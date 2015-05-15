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
    Event.create(body, function(err, savedEvent){
        if (err) return next(err);
        User.findOne({_id:req.user._id}, function(err, foundUser){
            savedEvent.creator = foundUser._id;
            savedEvent.challengers.push({user:foundUser._id, individualProgress: 0});
            savedEvent.save(function(err,saved){
                res.send(saved);
            });
        });
    })
});

router.get('/', function (req,res,next){
    Event.find({}).deepPopulate('creator challengers.user nonProfit').exec(function(err, events){
        var promises = events.map(function(eachEvent){
            return new Promise(function(resolve,reject)
            {
                resolve(eachEvent.calculateProgress());
            })
        });
        return Promise.all(promises).then(function(){
            res.send(events);
        });
      //    if (err) return next(err);
      //    res.send(events);
    });
});

router.get('/:eventId', function (req,res,next){
  Event.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit').exec(function(err, foundEvent){
      if (err) return next(err);
      foundEvent.calculateProgress().then(function(result){
        console.log('result should equal to sum of distance in first 7 days for all users', result);
        res.send(result);
      })
  });
});

router.delete('/:eventId', function(req,res,next){
    Event.findByIdAndRemove(req.params.eventId, function(err,event){
        if(err) return next(err);
        res.sendStatus(200);
    });
});

router.put('/:eventId', function(req,res,next){
    Event.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit').exec(function(err,foundEvent){
        if(err) return next(err);
        console.log("req.body", req.body);
        _.extend(foundEvent, req.body);
        console.log("after find",foundEvent);
        foundEvent.save(function(err,saved){
            res.send(saved);
        });
    });
});

router.post('/:eventId/join', function(req,res,next){
    Event.findById(req.params.eventId, function(err,event){
        var exists = false;
        _.forEach(event.challengers, function(challenger){
            if(challenger.user.toString()==req.body.userId.toString()){
                console.log('user already exists')
                exists = true;
            }
        });
       if(!exists) {
           event.challengers.push({
               user: req.body.userId,
               individualProgress: 0
           });
           event.save(function(err,saved){
               if(err) console.log(err);
               res.send(saved);
           });
       }else {
           res.sendStatus('409');
       }

    });
});

router.put('/:eventId/join', function(req,res,next){
    Event.findById(req.params.eventId, function(err,event){
        var filtered = _.filter(event.challengers, function(challenger){
            return challenger.user.toString()!==req.body.userId.toString()
        });
        if(event.challengers.length!==filtered.length){
            event.challengers = filtered;
            event.save(function(err,saved){
                res.send(saved);
            });
        } else {
            res.sendStatus('409');
        }

    });

});
router.put('/:eventId/sponsor', function(req,res,next){
  Event.findById(req.params.eventId, function(err,event){
      var filtered = _.filter(event.sponsor, function(eachSponsor){
          return eachSponsor.user.toString()!==req.body.userId.toString()
      });
      if(event.sponsor.length == filtered.length){
          event.sponsor.push({
              user: req.body.userId,
              details: req.body.details
          });
          event.save(function(err,saved){
              console.log('saved', saved.sponsor[0]);
              res.send(saved);
          });
      } else {
          console.log('already sponsored');
          res.sendStatus('409'); //You already sponsored!
      }
  });

});