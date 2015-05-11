'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var newEvent = require('mongoose').model('newEvent');

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