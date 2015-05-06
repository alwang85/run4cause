'use strict';
var path = require('path');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var fitbitConfig = app.getValue('env').FITBIT;

    var fitbitCredentials = {
        consumerKey: fitbitConfig.consumerKey,
        consumerSecret: fitbitConfig.consumerSecret,
        callbackURL: fitbitConfig.callbackURL
    };

    //var verifyCallback = function (accessToken, refreshToken, profile, done) {
    //
    //    UserModel.findOne({ 'facebook.id': profile.id }, function (err, user) {
    //
    //        if (err) return done(err);
    //
    //        if (user) {
    //            done(null, user);
    //        } else {
    //            UserModel.create({
    //                facebook: {
    //                    id: profile.id
    //                }
    //            }).then(function (user) {
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

    passport.use(new FitbitStrategy(fitbitCredentials,
        function(token, tokenSecret, profile, done){
            //process.nextTick(function(){
                console.log(profile);
                done(null,profile);
            //})
        }
    ));
    //verifyCallback

    app.get('/auth/fitbit', passport.authenticate('fitbit'));

    app.get('/auth/fitbit/callback',
        passport.authenticate('fitbit', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};