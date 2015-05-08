'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = mongoose.model('Event');
var Strategy = mongoose.model('Strategy');

router.post('/', function (res,req,next){
    var body = req.body;
    Strategy.create(body.strategy, function(err, savedStrategy){
        if (err) return next(err);
        body.event.strategy = savedStrategy._id;
        Event.create(body.event, function(err, savedEvent){
            res.send(savedEvent);
        })
    })
});