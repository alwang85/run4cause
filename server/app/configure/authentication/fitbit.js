'use strict';
var path = require('path');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    //var fitbitConfig = app.getValue('env').FITBIT;
    //
    //var fitbitCredentials = {
    //    consumerKey: fitbitConfig.consumerKey,
    //    consumerSecret: fitbitConfig.consumerSecret,
    //    callbackURL: fitbitConfig.callbackURL
    //};
    //
    //var verifyCallback = function (accessToken, refreshToken, profile, done) {
    //    UserModel.findOne({ 'fitbit.id': profile.id }, function (err, user) {
    //
    //        if (err) return done(err);
    //
    //        if (user) {
    //            done(null, user);
    //        } else {
    //            UserModel.create({
    //                fitbit: {
    //                    id: profile.id,
    //                    token: accessToken,
    //                    tokenSecret: refreshToken
    //                },
    //                name: profile._json.user.fullName
    //            }).then(function (user) {
    //
    //                done(null, user);
    //            }, function (err) {
    //                console.error('Error creating user from Facebook authentication', err);
    //                done(err);
    //            });
    //        }
    //
    //    });
    //
    //};
    //
    //passport.use(new FitbitStrategy(fitbitCredentials, verifyCallback));
    ////verifyCallback
    //
    //app.get('/auth/fitbit', passport.authenticate('fitbit'));
    //
    //app.get('/auth/fitbit/callback',
    //    passport.authenticate('fitbit', { failureRedirect: '/login' }),
    //    function (req, res) {
    //        console.log(req);
    //        res.redirect('/');
    //    });

    //app.post('/auth/jawbone', function(req, res, next) {
    //    var code = req.body.code;
    //    console.log("here")
    //});

};