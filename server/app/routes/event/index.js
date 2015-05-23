'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var Event = require('mongoose').model('Event');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var deepPopulate = require('mongoose-deep-populate');
var memjs = require('memjs');

var client = memjs.Client.create(process.env.MEMCACHEDCLOUD_SERVERS, {
  username: process.env.MEMCACHEDCLOUD_USERNAME,
  password: process.env.MEMCACHEDCLOUD_PASSWORD
});

var broadcastEventUpdate= function(eventId) {
  var io = require('../../../io')();
  //console.log('eventUpdated');
  io.emit('eventUpdate', eventId);
};


router.post('/', function (req,res,next){
    var event = req.body;
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));


    event.creator = req.user;
    event.challengers = [];
    event.challengers.push({user:req.user, individualProgress: 0});

    Event.create(event, function(err, savedEvent){
        if (err) return next(err);
        var user = req.user.toObject();
        var newEvent = savedEvent.toObject();
        newEvent.creator = user;
        newEvent.challengers = [{user:user, individualProgress: 0}];

        broadcastEventUpdate(newEvent._id);
        res.json(newEvent);

    });
});

router.get('/', function (req,res,next){
   //client.get('AllEvents', function (err, value, key) {
   //  if (value != null) {
   //    if(err) console.log(err);
   //    console.log('using memcached');
   //    res.send(JSON.parse(value.toString()));
   //  } else {
       Event.calculateProgressAll(function(err, events){
         if (err) return next(err);
         //client.set('AllEvents', JSON.stringify(events), function (err, val) {
         //  if (err) {
         //    console.log('failed to store', err);
         //    next(err);
         //  }
         //  console.log('stored val: ', val);
         //});
         res.send(events);
       })
     //};
   //});
});

router.get('/clearCache', function(req,res,next){
  client.delete('AllEvents');
  console.log('cache cleared');
});

router.get('/:eventId', function (req,res,next){
    Event.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit sponsors.user').exec(function(err, foundEvent){
        if (err) return next(err);
        res.json(foundEvent);
    });
});

router.delete('/:eventId', function(req,res,next){
    Event.findByIdAndRemove(req.params.eventId, function(err,event){
        if(err) return next(err);

        // TODO use the deleted event variable to get challengers
        // TODO use a USER METHOD that runs through his/her logs and resets the portion of his/her availability
        res.sendStatus(200);
    });
});

router.put('/:eventId', function(req,res,next){
    Event.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit sponsors.user').exec(function(err,foundEvent){
        if(err) return next(err);
        _.extend(foundEvent, req.body);
        foundEvent.save(function(err,saved){
            if (err) return next(err);
          broadcastEventUpdate(saved._id);
            res.send(saved);
        });
    });
});

router.put('/join/:eventId', function(req,res,next){
    var eventID = req.params.eventId;
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));

    Event.findById(req.params.eventId, function(err,event){
        var exists = false;
        _.forEach(event.challengers, function(challenger){
            if(challenger.user.toString()==req.user._id.toString()){
                console.log('user already exists');
                exists = true;
            }
        });
       if(!exists) {
           event.challengers.push({
               user: req.user,
               individualProgress: 0
           });
           event.save(function(err,saved){
               if(err) return next(err);
               // TODO use the new challenger
               // TODO use a USER METHOD that runs through his/her logs and sets the portion of his/her availability to true
               Event.calculateProgressAll(function(err, events){
                   if (err) return next(err);
                   var index = _.findIndex(events, function(event) {
                       return event._id.toString() === eventID;
                   });
                 broadcastEventUpdate(events[index]._id);
                   res.json(events[index]);
               });
           });
       } else {
           res.sendStatus('409');
       }

    });
});

router.put('/leave/:eventId', function(req,res,next){
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));
    var eventID = req.params.eventId;
    Event.findById(req.params.eventId, function(err,event){
        var filtered = _.filter(event.challengers, function(challenger){
            return challenger.user.toString()!==req.user._id.toString()
        });
        if(event.challengers.length!==filtered.length){
            event.challengers = filtered;

            // TODO use the deleted challenger
            // TODO use a USER METHOD that runs through his/her logs and resets the portion of his/her availability
            event.save(function(err,saved){
                if (err) return next(err);
                Event.calculateProgressAll(function(err, events){
                    if (err) return next(err);
                    //client.replace('AllEvents', JSON.stringify(events), function (err, val) {
                    //    if (err) {
                    //      console.log('failed to store', err);
                    //        next(err);
                    //    }
                    //  console.log('cache replaced');
                    //  //console.log('stored val: ', val);
                    //});

                    var index = _.findIndex(events, function(event) {
                        return event._id.toString() === eventID;
                    });
                    broadcastEventUpdate(events[index]._id);
                    res.json(events[index]);
                });
            });
        } else {
            res.sendStatus('409');
        }

    });
});

router.put('/sponsor/:eventId', function(req,res,next){
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));

    Event.findById(req.params.eventId, function(err,event){
        var filtered;
        if(!event.sponsors.length) filtered = [];
        else {
            filtered = _.filter(event.sponsors, function(eachSponsor){
                return eachSponsor.user.toString()!==req.user._id.toString();
            });
        }
      if(event.sponsors.length === filtered.length){
          event.sponsors.push({
              user: req.user._id,
              details: req.body.details
          });
          event.save(function(err,saved){
              if (err) return next(err);

              var eventObj = saved.toObject();

              var currentSponsor = _.filter(eventObj.sponsors, function(sponsor) {
                  return sponsor.user.toString() === req.user._id.toString();
              });
              if (currentSponsor.length === 1) {
                  currentSponsor[0].user = req.user;
                  broadcastEventUpdate(saved._id);
                  res.json(saved);
              } else {
                  console.log('already sponsored');
                  res.sendStatus('409'); //You already sponsored!
              }
              //Event.calculateProgressAll(function(err, events){
              //    if (err) return next(err);
              //    //client.replace('AllEvents', JSON.stringify(events), function (err, val) {
              //    //  if (err) {
              //    //      console.log('failed to store', err);
              //    //      next(err);
              //    //  }
              //    //  console.log('cache replaced');
              //    //  //console.log('stored val: ', val);
              //    //});
              //    var index = _.findIndex(events, function(event) {
              //        return event._id.toString() === saved._id;
              //    });
              //    //broadcastEventUpdate(events[index]._id);
              //    res.json(events[index]);
              //});
          });
      } else {
          console.log('already sponsored');
          res.sendStatus('409'); //You already sponsored!
      }
    });
});

