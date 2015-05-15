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
    });
});

router.get('/', function (req,res,next){
  request.get('https://watsi.org/fund-treatments.json', {
    json: true
  }, function(err, response, patients){
    res.json(patients.profiles);
  });
});
router.get('/:tokenId', function (req,res,next){
  request.get('https://watsi.org/profile/'+req.params.tokenId+'.json', {
    json: true
  }, function(err, response, patient){
    res.json(patient);
  });
});