'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Challenge = require('mongoose').model('Challenge');
var User = require('mongoose').model('User');

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
router.get('/:name', function (req,res,next){
  User.findOne({name: req.params.name}, function(err, foundUser){
    Challenge.findOne({_id: '555200872967028eb19b0e05' }).exec(function(err, challenge){
      //console.log(challenge);
      if (err) return next(err);
      challenge.calculateProgress(foundUser, function(err, result){
        console.log('result should equal to sum of distance in first 7 days', result);
        res.send(result.toString());
      })


      //    res.send(events);
    });
  });

});