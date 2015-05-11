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
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
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
var resultsMapper = function(provider, logItem) {
    var dateObj = this;

    var date, value;

    if (provider === 'fitbit') {
        var fitbitMap = {
            "activities-tracker-distance" : "distance",
            "activities-tracker-steps"    : "steps",
            "sleep-minutesAsleep"         : "sleep",
            "activities-tracker-calories" : "calories"
        };

        var fitbitObj = logItem[provider];

        _.forIn(fitbitMap, function(metricValue, metricKey) {
            //console.log(logItem[provider]);
            _.forEach(fitbitObj[metricKey], function(fitbitMetric) {
                date = fitbitMetric.dateTime;
                dateObj[date] = dateObj[date] ? dateObj[date] : { metrics : []};

                value = parseInt(fitbitMetric.value);
                if (metricValue === 'distance') {
                    value = Math.round(value * 1609.34);
                }

                dateObj[date].metrics.push({
                    measurement : metricValue,
                    qty         : value
                });
            });
        });
    }

    if (provider === 'jawbone') {
        var jawboneItems = logItem[provider].data.items;

        var date, value;
        _.forEach(jawboneItems, function(item) {
            date = item.date.toString().split('');
            date.splice(4,0,'-');
            date.splice(7,0,'-');
            date = date.join('');

            dateObj[date] = dateObj[date] ? dateObj[date] : { metrics : []};

            dateObj[date].metrics.push({
                measurement : "distance",
                qty         : item.details.distance
            });

            dateObj[date].metrics.push({
                measurement : "steps",
                qty         : item.details.steps
            });

            dateObj[date].metrics.push({
                measurement : "sleep",
                qty         : item.details.duration
            });

            dateObj[date].metrics.push({
                measurement : "calories",
                qty         : Math.round(item.details.calories + item.details.bmr)
            });
        });
    }
};


schema.method('parseData', function(result) {
        var log = [];
        var dateObj = {};

        _.forEach(result, function(logItem) {
            var provider = Object.keys(logItem)[0];

            resultsMapper.call(dateObj, provider, logItem);
        });

        var user = this;
        var loggedDates = Object.keys(dateObj);

        _.forEach(loggedDates, function(dateString) {
            var newDate = new Date(dateString);
            var index = _.findIndex(user.log, function(userLogItem) {
                 return userLogItem.date.getTime() === newDate.getTime();
            });

            if (index === -1) {
                user.log.push({
                    date : newDate,
                    metrics : dateObj[dateString].metrics
                });
            } else {
                user.log[index].metrics = dateObj[dateString].metrics;
            }
        });

        return new Promise(function(resolve, reject) {
            user.save(function(err, savedData) {
               if (err) {
                   reject(err);
               } else {
                   resolve(savedData);
               }
            });
        });
});


schema.method('updateLogs', function() {
    var user = this;
    var activeDevices = user.active;

    var findPromise = new Promise(function(resolve, reject) {
        user.model('API').find({
            source : {$in : activeDevices}
        }, function(err, sources) {
            if (err) {
                reject(err);
            } else {
                resolve(sources);
            }
        });
    });
    return findPromise
    .then(function(apis) {
        var allRequests = _.map(apis, function(provider) {

            var tokenHeader = {
                Authorization : 'Bearer ' + user[provider.source].token
            };

            var promises = [];

            _.forEach(provider.metrics, function(api) {
                promises.push(request.getAsync({
                    url : api.apiRoute,
                    headers : tokenHeader,
                    qs : {
                        date : 20150511
                    }
                }));
            });

            return Promise.all(promises)
            .then(function(results) {

                results = _.chain(results)
                    .map(function(item) {
                        return JSON.parse(item[1]);
                    })
                    .reduce(function(objResult, jsonParsedItem) {
                        return _.merge(objResult, jsonParsedItem)
                    }, {})
                    .value();

                var returnObj = {};
                returnObj[provider.source] = results;
                return returnObj;
            });
        });

        return Promise.all(allRequests);
    })
    .then(function(results) {
        return user.parseData(results);
    });
});

mongoose.model('User', schema);