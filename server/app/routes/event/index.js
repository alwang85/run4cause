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
var broadcastChanges = function() {
  var io = require('../../../io')();

  io.sockets.emit('eventsChange');
};

router.post('/', function (req,res,next){
    var body = req.body;
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));

    Event.create(body, function(err, savedEvent){
        if (err) return next(err);
        savedEvent.creator = req.user;
        savedEvent.challengers.push({user:req.user, individualProgress: 0});
        savedEvent.save(function(err,saved){
            broadcastChanges();
            res.json(saved);
        });
    })
});

router.get('/', function (req,res,next){
   client.get('AllEvents', function (err, value, key) {
     if (value != null) {
       if(err) console.log(err);
       console.log('using memcached');
       res.send(JSON.parse(value.toString()));
     } else {
       Event.calculateProgressAll(function(err, events){
         if (err) return next(err);
         client.set('AllEvents', JSON.stringify(events), function (err, val) {
           if (err) {
             console.log('failed to store', err);
             next(err);
           }
           console.log('stored val: ', val);
         });
         res.send(events);
       })
     };
   });
});

router.get('/:eventId', function (req,res,next){
    Event.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit sponsors.user').exec(function(err, foundEvent){
        if (err) return next(err);
        foundEvent.calculateProgress().then(function(result){
            res.json(result);
        }).catch(next);
    });
});

router.delete('/:eventId', function(req,res,next){
    Event.findByIdAndRemove(req.params.eventId, function(err,event){
        if(err) return next(err);
        res.sendStatus(200);
    });
});

router.put('/:eventId', function(req,res,next){
    Event.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit sponsors.user').exec(function(err,foundEvent){
        if(err) return next(err);
        _.extend(foundEvent, req.body);
        foundEvent.save(function(err,saved){
            if (err) return next(err);
            res.send(saved);
        });
    });
});

router.post('/:eventId/join', function(req,res,next){
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
               Event.calculateProgressAll(function(err, events){
                   if (err) return next(err);
                   client.replace('AllEvents', JSON.stringify(events), function (err, val) {
                       if (err) {
                         console.log('failed to store', err);
                          next(err);
                       }
                     console.log('cache replaced');
                     //console.log('stored val: ', val);
                 });
                 res.json(saved);
               })

           });
       } else {
           res.sendStatus('409');
       }

    });
});

router.delete('/:eventId/leave', function(req,res,next){
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));

    Event.findById(req.params.eventId, function(err,event){
        var filtered = _.filter(event.challengers, function(challenger){
            return challenger.user.toString()!==req.user._id.toString()
        });
        if(event.challengers.length!==filtered.length){
            event.challengers = filtered;
            event.save(function(err,saved){
                if (err) return next(err);
                Event.calculateProgressAll(function(err, events){
                    if (err) return next(err);
                    client.replace('AllEvents', JSON.stringify(events), function (err, val) {
                        if (err) {
                          console.log('failed to store', err);
                            next(err);
                        }
                      console.log('cache replaced');
                      //console.log('stored val: ', val);
                    });
                    res.json(saved);
                })
            });
        } else {
            res.sendStatus('409');
        }

    });
});

router.put('/:eventId/sponsor', function(req,res,next){//TODO delete cache + replace
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
              console.log('saved', saved.sponsor[0]);
              Event.calculateProgressAll(function(err, events){
                  if (err) return next(err);
                  client.replace('AllEvents', JSON.stringify(events), function (err, val) {
                    if (err) {
                        console.log('failed to store', err);
                        next(err);
                    }
                    console.log('cache replaced');
                    //console.log('stored val: ', val);
                  });
                   broadcastChanges();
                  res.json(saved);
              });
          });
      } else {
          console.log('already sponsored');
          res.sendStatus('409'); //You already sponsored!
      }
    });
});