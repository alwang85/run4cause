'use strict';
var router = require('express').Router();
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var OAuth2 = require('oauth').OAuth2;
var _ = require('lodash');

module.exports = function(app) {

    // sign up
    router.post('/signup', function (req, res, next) {
        var newUser = req.body;

        if (newUser.password !== newUser.passwordConfirm) {
            var error = new Error('Passwords do not match');
            error.status = 401;
            return next(error);
        }


        delete newUser.passwordConfirm;
        User.create(newUser, function (err, returnedUser) {
            if (err) return next(err);
            req.logIn(returnedUser, function (err) {
                if (err) return next(err);
                // We respond with a reponse object that has user with _id and email.
                res.status(200).send({user: _.omit(returnedUser.toJSON(), ['password', 'salt'])});
            });

        });
    });

    // link user device
    // TODO possibly refactoring some/all of this to User Model statics/methods
    router.post('/device', function (req, res, next) {

        // setting up params
        var authInfo = req.body;
        var config = app.getValue('env')[authInfo.provider.toUpperCase()];
        var params = {
            grant_type: 'authorization_code',
            redirect_uri : authInfo.redirectUri
        };

        // custom headers for fitbit AUTH 2.0
        var customHeaders = null;
        if (authInfo.provider === 'fitbit') {
            var authHeader = config.clientID + ":" + config.clientSecret;
            console.log(authHeader);
            customHeaders = {
                Authorization : "Basic " + new Buffer(authHeader).toString('base64')
            };
        }

        // oauth request to retrieve access token
        var oauth = new OAuth2(config.clientID, config.clientSecret, '', config.authorizationURL, config.tokenURL, customHeaders);
        oauth.getOAuthAccessToken(authInfo.code, params, function(err, accessToken, refreshToken, params) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log(params);
            // update user to have the access token
            User
            .findById(authInfo.user, function(err, user) {
                if (err) return err;
                if (_.indexOf(user.active, authInfo.provider) === -1) {
                    user.active.push(authInfo.provider);
                }

                // storing oauth info
                user[authInfo.provider].token = accessToken;

                // fitbit only shows expires_in as time left, and jawbone gives initial epoch timestamp
                // might need to re-link the device if some calls do not work, until refreshtoken is working
                if (params.expires_in) {
                    user[authInfo.provider].expires_in = params.expires_in < 10000 ? Math.round((new Date()).getTime() * params.expires_in * 1000) : Math.round(params.expires_in * 1000);
                }

                if (params.refresh_token || refreshToken) {
                    user[authInfo.provider].refresh_token = params.refresh_token || refreshToken;
                }

                user.save(function(err, savedUser) {
                    if (err) return next(err);

                    res.send({user : _.omit(savedUser.toJSON(), ['password', 'salt'])});
                });
            });
        });
    });

    //// TODO refresh user tokens
    //router.put('/logs/:user_id', function(req,res,next) {
    //    var user_id = req.params.user_id;
    //
    //    User.findById(user_id, function(err, user) {
    //        user.refreshTokens().then(function(refreshedUser){
    //            res.json(refreshedUser);
    //        }).catch(function(err){
    //            next(err);
    //        });
    //    });
    //});

    // update user log
    router.put('/logs', function(req,res,next) {
        var user_id = req.params.user_id;

        req.user.updateLogs()
        .then(function(logs) {
            console.log(logs);
            res.json(logs);
        }).catch(function(err) {
            next(err);
        });
    });

    //Get All users
    router.get('/', function (req, res, next) {
        User.find({}, function (err, foundUser) {
            if (err) return next(err);
            res.send(foundUser);
        });
    });

    //Get single user
    router.get('/:user_id', function (req, res, next) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) return next(err);

            res.json(user);
        });
    });

    // update user
    router.put('/:user_id', function (req, res, next) {
        var user_id = req.params.user_id;
        if (!user_id) return next(new Error("Specify user id"));

        User.findById(user_id, function (err, user) {
            if (err) return next(err);
            _.extend(user, req.body);

            user.save(function (err, savedData) {
                console.log(savedData);
                if (err) return next(err);
                res.json(savedData);
            });

        });
    });

    // delete user
    router.delete('/:user_id', function (req, res, next) {
        var queryId = req.params.user_id;
        if (!queryId) return next(new Error("Please specify an Id"));

        User.findByIdAndRemove(queryId, function (err, removedUser) {
            if (err) return next(err);
            res.send(removedUser);
        });
    });

    return router;
};