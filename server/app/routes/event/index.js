'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = require('mongoose').model('Event');
var Strategy = require('mongoose').model('Strategy');

router.post('/', function (req,res,next){
    var body = req.body;
    Strategy.create(body.strategy, function(err, savedStrategy){
        if (err) return next(err);
        body.event.strategy = savedStrategy._id;
        Event.create(body.event, function(err, savedEvent){
            res.send(savedEvent);
        })
    })
});

//router.get('/', function (req,res,next){
//    console.log("this is api event", req.query.userId)
//    var userId = req.query.userId;
//    Event.find({creator: userId}).populate('creator nonProfit strategy').exec(function(err, events){
//        console.log(events)
//        if (err) return next(err);
//        res.send(events);
//    });
//});