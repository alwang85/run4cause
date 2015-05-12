// collecting all activities from all devices
var Promise = require('bluebird');
var _ = require('lodash');

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
        var jawboneItems = logItem[provider].items;

        var date, value;
        _.forEach(jawboneItems, function(item) {
            date = item.date.toString().split('');
            date.splice(4,0,'-');
            date.splice(7,0,'-');
            date = date.join('');

            dateObj[date] = dateObj[date] ? dateObj[date] : { metrics : []};

            if(item.details.distance){
                dateObj[date].metrics.push({
                    measurement : "distance",
                    qty         : item.details.distance
                });
            }

            if(item.details.steps){
                dateObj[date].metrics.push({
                    measurement : "steps",
                    qty         : item.details.steps
                });
            }

            if(item.details.duration){
                dateObj[date].metrics.push({
                    measurement : "sleep",
                    qty         : item.details.duration
                });
            }

            if(item.details.calories){
                dateObj[date].metrics.push({
                    measurement : "calories",
                    qty         : Math.round(item.details.calories + item.details.bmr)
                });
            }
        });
    }
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