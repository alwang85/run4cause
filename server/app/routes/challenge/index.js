'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Challenge = require('mongoose').model('Challenge');

router.post('/', function (req,res,next){
  var body = req.body;
  Challenge.create(body, function(err, savedChallenge){
    if (err) return next(err);
    res.send(savedChallenge);
  })
});

router.get('/', function (req,res,next){
  Challenge.find({}).populate('metric category').exec(function(err, challenges){
    console.log(challenges);
    if (err) return next(err);
    res.send(challenges);
    //    res.send(events);
  });
});