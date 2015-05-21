'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var Event = require('mongoose').model('Event');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var deepPopulate = require('mongoose-deep-populate');

router.post('/', function (req,res,next){
    var body = req.body;
    if (!req.user) return next(new Error('Forbidden: You Must Be Logged In'));

    Event.create(body, function(err, savedEvent){
        if (err) return next(err);
        savedEvent.creator = req.user;
        savedEvent.challengers.push({user:req.user, individualProgress: 0});
        savedEvent.save(function(err,saved){
            res.json(saved);
        });
    })
});

router.get('/', function (req,res,next){
    Event.find({}).deepPopulate('creator challengers.user sponsors.user').exec(function(err, events){
        if (err) return next(err);

        var promises = events.map(function(eachEvent){
            return new Promise(function(resolve,reject) {
                resolve(eachEvent.calculateProgress());
            });
        });

        return Promise.all(promises).then(function(){
            res.send(events);
        }).catch(next);
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
               res.json(saved);
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
                res.json(saved);
            });
        } else {
            res.sendStatus('409');
        }

    });
});

router.put('/:eventId/sponsor', function(req,res,next){
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
              console.log('saved', saved.sponsors);
              res.send(saved);
          });
      } else {
          console.log('already sponsored');
          res.sendStatus('409'); //You already sponsored!
      }
    });
});