'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Fitbit = require('fitbit');
var FitbitApiClient = require("fitbit-node");
var User = require('mongoose').model('User');

module.exports = function(app) {
    var fitbitConfig = app.getValue('env').FITBIT;

    router.get('/getUserData', function (req, res, next) {
        var tokenSecret = req.user.fitbit.tokenSecret;
        var token = req.user.fitbit.token;
        var id = req.user.fitbit.id;

        // promise all
        var client = new FitbitApiClient(fitbitConfig.consumerKey,fitbitConfig.consumerSecret);

        var promises = [
            client.requestResource("/activities/tracker/calories/date/today/7d.json", "GET", token, tokenSecret),
            client.requestResource("/activities/tracker/steps/date/today/7d.json", "GET", token, tokenSecret),
            client.requestResource("/activities/tracker/distance/date/today/7d.json", "GET", token, tokenSecret),
            client.requestResource("/sleep/minutesAsleep/date/today/7d.json", "GET", token, tokenSecret)
        ];

        Promise.all(promises)
            .spread(function(calories, steps, distance, sleep) {
                sleep = JSON.parse(sleep[0])["sleep-minutesAsleep"];
                console.log(sleep);
                calories = JSON.parse(calories[0])["activities-tracker-calories"];
                steps = JSON.parse(steps[0])["activities-tracker-steps"];
                distance = JSON.parse(distance[0])["activities-tracker-distance"];
                var result = [];

                _.forEach(calories, function(item, index){
                    var tempObj = {
                        date: item.dateTime,
                        metrics: [{measurement: 'calories', qty:item.value},
                                  {measurement: 'steps', qty:steps[index].value},
                                  {measurement: 'distance', qty:distance[index].value},
                                  {measurement:'sleep', qty:sleep[index].value}]
                    };
                   result.push(tempObj);
                });
                User.findOne({_id: req.user._id}, function(err, foundUser){
                  foundUser.log = foundUser.log.concat(result);
                  foundUser.save(function(err, savedUser){
                    console.log('saved the log!');
                    res.json(result);
                  });
                })
            })
            .catch(function(err) {
                next(err);
            });


    });

    return router;
};

