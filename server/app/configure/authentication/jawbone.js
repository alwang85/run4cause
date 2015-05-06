'use strict';
var path = require('path');
var passport = require('passport');
var JawboneStrategy = require('passport-oauth').OAuth2Strategy;
var Promise = require('bluebird');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function(app) {
    var jawboneConfig = app.getValue('env').JAWBONE;

    var jawboneCredentials = {
        clientID         : jawboneConfig.clientID,
        clientSecret     : jawboneConfig.clientSecret,
        authorizationURL : jawboneConfig.authorizationURL,
        tokenURL         : jawboneConfig.tokenURL,
        callbackURL      : jawboneConfig.callbackURL
    };

    var jawboneStrategy = function(token, refreshToken, profile, done) {
        var options = {
            access_token  : token,
            client_id     : jawboneConfig.clientID,
            client_secret : jawboneConfig.clientSecret
        },
            up = require('jawbone-up')(options);

        up.me.get({}, function(err, body) {
            if (err) return done(err);
            body = JSON.parse(body);

            UserModel.findOne({ 'jawbone.id': body.meta.user_xid }, function (err, user) {

                if (err) return done(err);

                if (user) {
                    done(null, user);
                } else {
                    UserModel.create({
                        jawbone: {
                            id: body.meta.user_xid,
                            token : token
                        }
                    }).then(function (user) {
                        done(null, user);
                    }, function (err) {
                        console.error('Error creating user from Jawbone authentication', err);
                        done(err);
                    });
                }
            });
        })
    };

    // creating jawbone authentication
    passport.use('jawbone', new JawboneStrategy(jawboneCredentials, jawboneStrategy));

    app.get('/auth/jawbone', passport.authenticate('jawbone', {
        scope : ['basic_read', 'sleep_read', 'move_read'],
        failureRedirect: '/'
    }));

    app.get('/auth/jawbone/callback',
        passport.authenticate('jawbone', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });
};
