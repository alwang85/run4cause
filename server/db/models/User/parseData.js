// collecting all activities from all devices
var Promise = require('bluebird');
var _ = require('lodash');
var APImap = require('./apiMap');

var resultsMapper = function(provider, logItem) {
    var dateObj = this;
    APImap[provider](provider, logItem, dateObj);
};

module.exports = function(result) {
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
        user.lastLogUpdate = new Date();
        user.save(function(err, savedData) {
            if (err) {
                reject(err);
            } else {
                resolve(savedData);
            }
        });
    });
};