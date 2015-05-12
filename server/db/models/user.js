'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var _ = require('lodash');

var schema = new mongoose.Schema({
    active : {type: [String], default: []},
    firstName : String,
    lastName  : String,
    joinedTime : { type: Date, default : Date.now }, // might be needed to get the initial batch of logs
    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    jawbone: {
        token : String,
        refresh_token : String,
        expires_in : Number
    },
    fitbit: {
        token: String,
        refresh_token : String,
        expires_in : Number
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'newEvent'}],
    log: [{
      date: Date,
      metrics: [{
        measurement: String, //distance
        qty: Number
      }]
    }]
});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }
    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

// refresh tokens
schema.method('refreshTokens', function(config) {
    var user = this;
    var active = user.active;


    return user;
});

// collecting all activities from all devices
// TODO: need to filter out the result and update it to the user
// TODO: pass in date parameters to retrieve the latest missing logs
schema.method('updateLogs', function() {
    var user = this;
    var activeDevices = user.active;

    // create promises with all requests
    // possibly a better way to set these custom headers
    var allRequests = _.map(activeDevices, function(provider) {
        var tokenHeader = {
            Authorization : 'Bearer ' + user[provider].token
        };

        if (provider === 'fitbit') {
            var fitbit_promises = [];
            fitbit_promises.push(request.getAsync({
                url : 'https://api.fitbit.com/1/user/-/activities/date/today.json',
                headers : tokenHeader
            }));

            fitbit_promises.push(request.getAsync({
                url : 'https://api.fitbit.com/1/user/-/sleep/date/today.json',
                headers : tokenHeader
            }));

            return Promise.all(fitbit_promises);
        }

        if (provider === "jawbone") {
            var jawbone_promises = [];

            jawbone_promises.push(request.getAsync({
                url : 'https://jawbone.com/nudge/api/v.1.1/users/@me/moves',
                headers : tokenHeader
            }));

            jawbone_promises.push(request.getAsync({
                url : 'https://jawbone.com/nudge/api/v.1.1/users/@me/sleeps',
                headers : tokenHeader
            }));

            return Promise.all(jawbone_promises);
        }
    });

    return Promise
        .all(allRequests)
        .then(function(results){
            // flatten out to remove nested arrays
            return _.map(_.flattenDeep(results), function(item) {
                if (item.body) return JSON.parse(item.body);

                return JSON.parse(item);
            });
        });
});

mongoose.model('User', schema);