'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var newEvent = require('mongoose').model('newEvent');
var deepPopulate = require('mongoose-deep-populate');

router.post('/', function (req,res,next){
    var body = req.body;
    newEvent.create(body, function(err, savedEvent){
        if (err) return next(err);
        res.send(savedEvent);
    })
});

router.get('/', function (req,res,next){
    newEvent.find({}).populate('challenges challengers nonProfit').exec(function(err, events){
      console.log(events);
      res.send(events);
      //    if (err) return next(err);
      //    res.send(events);
    });
});
router.get('/:eventId', function (req,res,next){
  newEvent.findById(req.params.eventId).deepPopulate('challenges.challenge challengers.user').exec(function(err, foundEvent){
      if (err) return next(err);
      foundEvent.calculateProgress(function(err, result){
        console.log('result should equal to sum of distance in first 7 days for all users', result);
        res.send(result);
      })
  });
});