var Promise = require('bluebird');
var _ = require('lodash');
var request = Promise.promisifyAll(require('request'));

module.exports = function(config) {
    var user = this;
    var params = {
        grant_type : "refresh_token"
    };

    var active = user.active;

    var promises = _.map(active, function(provider) {
        var customHeaders = {}, authHeader, oauth;
        var providerConfig = config[provider.toUpperCase()];
        params.refresh_token = user[provider].refresh_token;

        if (provider === 'fitbit') {
            authHeader = providerConfig.clientID +
                ":" + providerConfig.clientSecret;

            customHeaders.Authorization = "Basic " + new Buffer(authHeader).toString('base64');
        }

        if (provider === 'jawbone') {
            params.client_id = providerConfig.clientID;
            params.client_secret = providerConfig.clientSecret;
        }

        return request.postAsync(providerConfig.refreshTokenURL, {
            form : params,
            headers : customHeaders
        }).then(function(response) {
            var response = JSON.parse(response[1]);
            console.log(response);
            if (!response.errors) {
                if (response.refresh_token) {
                    user[provider].refresh_token = response.refresh_token;
                }

                user[provider].token = response.access_token;
                user[provider].expires_in = response.expires_in < 10000 ? Math.round((new Date()).getTime() + response.expires_in * 1000) : Math.round(response.expires_in);
            } else {
                throw response.errors;
            }
        });
    });


    return Promise.all(promises)
        .then(function() {
            return new Promise(function(resolve, reject) {
                user.save(function(err, savedUser) {
                    if (err) return reject(err);
                    resolve(savedUser);
                });
            });
        });
};