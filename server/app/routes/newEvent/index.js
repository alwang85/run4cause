'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var newEvent = require('mongoose').model('newEvent');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var deepPopulate = require('mongoose-deep-populate');

router.post('/', function (req,res,next){
    var body = req.body;
    newEvent.create(body, function(err, savedEvent){
        if (err) return next(err);
        User.findOne({_id:req.user._id}, function(err, foundUser){
           foundUser.events.push(savedEvent._id);
            foundUser.save(function(err,saved){
                res.send(savedEvent);
            });
        });
    })
});

router.get('/', function (req,res,next){
    newEvent.find({}).deepPopulate('creator challengers.user nonProfit').exec(function(err, events){
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
  newEvent.findById(req.params.eventId).deepPopulate('creator challengers.user nonProfit').exec(function(err, foundEvent){
      if (err) return next(err);
      foundEvent.calculateProgress().then(function(result){
        console.log('result should equal to sum of distance in first 7 days for all users', result);
        res.send(result);
      })
  });
});