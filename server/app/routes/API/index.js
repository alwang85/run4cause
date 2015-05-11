'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var API = require('mongoose').model('API');


router.post('/', function (req,res,next){
  var body = req.body;
  API.create(body, function(err, savedAPI){
    if (err) return next(err);
    res.send(savedAPI);
  })
});

router.get('/', function (req,res,next){
  API.find({}).exec(function(err, APIList){
    console.log(APIList);
    if (err) return next(err);
    res.send(APIList);
    //    res.send(events);
  });
});