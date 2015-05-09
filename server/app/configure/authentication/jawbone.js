'use strict';
var path = require('path');
var passport = require('passport');
var JawboneStrategy = require('passport-oauth').OAuth2Strategy;
var Promise = require('bluebird');
var mongoose = require('mongoose');
var OAuth2 = require('oauth').OAuth2;
var UserModel = mongoose.model('User');

module.exports = function(app) {
    //var jawboneConfig = app.getValue('env').JAWBONE;
    //
    //// specifying credentials
    //var jawboneCredentials = {
    //    clientID         : jawboneConfig.clientID,
    //    clientSecret     : jawboneConfig.clientSecret,
    //    authorizationURL : jawboneConfig.authorizationURL,
    //    tokenURL         : jawboneConfig.tokenURL,
    //    callbackURL      : jawboneConfig.callbackURL
    //};
    //
    //// defining oauth2 for ajax jawbone authentication
    //var jawboneOauth = new OAuth2(jawboneCredentials.clientID, jawboneCredentials.clientSecret, '', jawboneCredentials.authorizationURL, jawboneCredentials.tokenURL);
    //
    //var jawboneStrategy = function(token, refreshToken, profile, done) {
    //    var options = {
    //        access_token  : token,
    //        client_id     : jawboneConfig.clientID,
    //        client_secret : jawboneConfig.clientSecret
    //    },
    //        up = require('jawbone-up')(options);
    //
    //    up.me.get({}, function(err, body) {
    //        if (err) return done(err);
    //        body = JSON.parse(body);
    //
    //        UserModel.findOne({ 'jawbone.id': body.meta.user_xid }, function (err, user) {
    //
    //            if (err) return done(err);
    //
    //            if (user) {
    //                done(null, user);
    //            } else {
    //                UserModel.create({
    //                    name: body.data.first + " " + body.data.last,
    //                    active : ['jawbone'],
    //                    jawbone: {
    //                        id: body.meta.user_xid,
    //                        token : token
    //                    }
    //                }).then(function (user) {
    //                    done(null, user);
    //                }, function (err) {
    //                    console.error('Error creating user from Jawbone authentication', err);
    //                    done(err);
    //                });
    //            }
    //        });
    //    });
    //};
    //
    //// creating jawbone authentication
    //passport.use('jawbone', new JawboneStrategy(jawboneCredentials, jawboneStrategy));
    //
    //app.get('/auth/jawbone', passport.authenticate('jawbone', {
    //    scope : ['basic_read', 'sleep_read', 'move_read'],
    //    failureRedirect: '/'
    //}));
    //
    //app.get('/auth/jawbone/callback',
    //    passport.authenticate('jawbone', { failureRedirect: '/login' }),
    //    function (req, res) {
    //        res.redirect('/');
    //    });
    //
    //
    //// Ajax
    app.post('/auth/jawbone', function(req, res, next) {
        var code = req.body.code;
        var params = {
            clientID         : jawboneConfig.clientID,
            clientSecret     : jawboneConfig.clientSecret,
            grant_type       : 'authorization_code',
            redirect_uri     : req.body.redirectUri,
            tokenURL         : jawboneConfig.tokenURL
        };

        jawboneOauth.getOAuthAccessToken(code, params, function(err, accessToken, refreshToken, params) {
            if (err) return next(err);
            console.log(accessToken);
            res.json({
                token : accessToken
            });
        });
    });
};

