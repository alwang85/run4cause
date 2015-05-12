'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Challenge = require('mongoose').model('Challenge');

router.post('/', function (req,res,next){
  var body = req.body;
  body.creator = req.user._id;
  Challenge.create(body, function(err, savedChallenge){
    if (err) return next(err);
    res.send(savedChallenge);
  })
});

router.get('/', function (req,res,next){
  var userId = req.query.user;
  Challenge.find({creator: userId }, function(err, challenges){
    if (err) return next(err);
    res.send(challenges);
    //    res.send(events);
  });
});