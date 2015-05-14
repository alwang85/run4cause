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
                res.json(_.omit(savedUser.toJSON(), ['password', 'salt', 'jawbone', 'fitbit']));
            });
        });
    });

    // callback from linking user device
    router.post('/device', function (req, res, next) {
        // setting up params
        var authInfo = req.body;
        var config = app.getValue('env')[authInfo.provider.toUpperCase()];

        User.findByIdAndHandleLinkDeviceCallback(authInfo, config)
        .then(function(savedUser) {
            res.json(_.omit(savedUser.toJSON(), ['password', 'salt', 'jawbone', 'fitbit']));
        })
        .catch(next);
    });

    // refresh tokens
    router.put('/tokens', function(req,res,next) {
        var user_id = req.user.id;
        var config = app.getValue('env');
        User.findById(user_id, function(err, user) {
            if (err) return next(err);

            user.refreshTokens(config).then(function(refreshedUser){
                res.json(_.omit(refreshedUser.toJSON(), ['password', 'salt', 'jawbone', 'fitbit']));
            }).catch(next);
        });
    });

    // update user log by devices connected
    router.put('/logs', function(req,res,next) {
        var user_id = req.params.user_id;

        req.user.updateUserLogs()
        .then(function(logs) {
            res.json(logs);
        }).catch(next);
    });

    router.get('/logs', function(req,res,next) {
        req.user.getUserLogs()
            .then(function(logs) {
                res.json(logs);
            }).catch(next);
    });

    //Get All users
    router.get('/', function (req, res, next) {
        User.find({}, function (err, foundUser) {
            if (err) return next(err);
            res.json(foundUser);
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


        _.extend(req.user, req.body);

        req.user.save(function (err, savedData) {
            console.log(savedData);
            if (err) return next(err);
            res.json(savedData);
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