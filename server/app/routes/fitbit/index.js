'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Fitbit = require('fitbit');
var FitbitApiClient = require("fitbit-node");

module.exports = function(app) {
    var fitbitConfig = app.getValue('env').FITBIT;





    router.get('/getUserSteps', function (req, res, next) {
        var tokenSecret = req.user.fitbit.tokenSecret;
        var token = req.user.fitbit.token;
        var id = req.user.fitbit.id;
         //potentially better solution
        var client = new FitbitApiClient(fitbitConfig.consumerKey,fitbitConfig.consumerSecret);
        client.requestResource("/activities/steps/date/today/1m.json", "GET", token, tokenSecret)
            .then(function(response){
                console.log(response[0]);
            }).catch(function(err){
                console.log(err)
            });
    });

    //    var client = new Fitbit(
    //        fitbitConfig.consumerKey
    //        , fitbitConfig.consumerSecret
    //        , { // Now set with access tokens
    //            accessToken: token
    //            , accessTokenSecret: tokenSecret
    //            , unitMeasure: 'en_GB'
    //    }
    //    );
    //    client.getActivities({date: '2015-04-15'}, function (err, activities) {
    //        if (err) {
    //            // Take action
    //            return;
    //        }
    //
    //        // `activities` is a Resource model
    //        console.log('Total steps today: ', activities);
    //    });
    //
    //});

    return router;
};

