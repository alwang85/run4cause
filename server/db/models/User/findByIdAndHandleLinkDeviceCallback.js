var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment-range');
var OAuth2 = require('oauth').OAuth2;

module.exports = function(authInfo, config) {
    var User = this;
    var params = {
        grant_type: 'authorization_code',
        redirect_uri : authInfo.redirectUri
    };

    // custom headers for fitbit AUTH 2.0
    var customHeaders = null;
    if (authInfo.provider === 'fitbit') {
        var authHeader = config.clientID + ":" + config.clientSecret;
        customHeaders = {
            Authorization : "Basic " + new Buffer(authHeader).toString('base64')
        };
    }

    // oauth request to retrieve access token
    var oauth = new OAuth2(
        config.clientID,
        config.clientSecret, '',
        config.authorizationURL,
        config.tokenURL,
        customHeaders
    );

    return new Promise(function(resolve, reject) {
        oauth.getOAuthAccessToken(authInfo.code, params, function(err, accessToken, refreshToken, params) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            console.log(refreshToken);
            console.log(params);
            User.findById(authInfo.user, function(err, user) {
                if (err) return reject(err);
                if (_.indexOf(user.active, authInfo.provider) === -1) {
                    user.active.push(authInfo.provider);
                }

                // storing oauth info
                user[authInfo.provider].token = accessToken;

                // fitbit only shows expires_in as time left, and jawbone gives initial epoch timestamp
                // might need to re-link the device if some calls do not work, until refresh token is working
                if (params.expires_in) {
                    user[authInfo.provider].expires_in = params.expires_in < 10000 ? Math.round((new Date()).getTime()/1000 + params.expires_in) : Math.round(params.expires_in);
                }

                user[authInfo.provider].refresh_token = refreshToken || params.refresh_token;
                user.lastLogUpdate = moment().subtract(1, 'days').toDate();
                user.save(function(err, savedUser) {
                    if (err) return reject(err);

                    resolve(savedUser);
                });
            });
        });
    });
};