'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Nonprofit = require('mongoose').model('Nonprofit');


router.post('/', function (req,res,next){
  var body = req.body;
  Nonprofit.create(body, function(err, savedNonprofit){
    if (err) return next(err);
    res.send(savedNonprofit);
  })
});

router.get('/', function (req,res,next){
  Nonprofit.find({}).exec(function(err, nonprofits){
    console.log(nonprofits);
    if (err) return next(err);
    res.send(nonprofits);
    //    res.send(events);
  });
});