'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Metric = require('mongoose').model('Metric');


router.post('/', function (req,res,next){
  var body = req.body;
  Metric.create(body, function(err, savedMetric){
    if (err) return next(err);
    res.send(savedMetric);
  })
});

router.get('/', function (req,res,next){
  Metric.find({}).exec(function(err, metrics){
    console.log(metrics);
    if (err) return next(err);
    res.send(metrics);
    //    res.send(events);
  });
});