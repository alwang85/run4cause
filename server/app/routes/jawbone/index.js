'use strict';
var router = require('express').Router();
var _ = require('lodash');
var Promise = require('bluebird');
var User = require('mongoose').model('User');

module.exports = function(app){
    var jawboneConfig = app.getValue('env').JAWBONE;

    var jawboneOptions = function(req, res, next){
        req.up = require('jawbone-up')({
            access_token: req.user.jawbone.token,
            client_id: jawboneConfig.clientID,
            client_secret: jawboneConfig.clientSecret
        });
        next();
    };

    router.use(jawboneOptions);

    router.get("/getUserData", function(req, res, next){

        var getMoves = new Promise(function(resolve, reject) {
            req.up.moves.get(req.query, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }

                data = JSON.parse(data);

                resolve(data);
            });
        });

        var getSleeps = new Promise(function(resolve, reject) {
            req.up.sleeps.get(req.query, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }

                data = JSON.parse(data);

                resolve(data);
            });
        });

        Promise.all([
            getMoves,
            getSleeps
        ]).spread(function(moves, sleeps) {
            var items = moves.data.items.concat(sleeps.data.items);
            var dateLog = {};

            _.forEach(items, function(item) {
                var date = item.date.toString();

                dateLog[date] = dateLog[date] || [];

                if (item.type === 'move') {
                    dateLog[date].push(
                        {
                            measurement: 'calories',
                            qty: Math.round(item.details.calories)
                        },
                        {
                            measurement: 'steps',
                            qty: item.details.steps
                        },
                        {
                            measurement: 'distance',
                            qty: item.details.distance // in meters
                        }
                    );
                } else {
                    dateLog[date].push(
                        {
                            measurement: 'sleep',
                            qty: item.details.duration
                        }
                    );
                }
            });

            var log = [];
            _.forEach(_.keys(dateLog).sort(), function(date) {
                log.push({
                    date : new Date(date.slice(0, 4), date.slice(4, 6), date.slice(6)),
                    metrics : dateLog[date]
                })
            });
            User.findOne({_id: req.user._id}, function(err, foundUser){
              foundUser.log = foundUser.log.concat(log);
              foundUser.save(function(err, savedUser){
                console.log('saved the log!');
                res.json(log);
              });
            })
        });
    });

    return router;

};