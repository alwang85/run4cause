'use strict';
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Promise = require('bluebird');
var _ = require('lodash');

var LogSchema = new mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId, ref: 'User' },
    logData : [{
        date: Date,
        metrics: [{
            measurement: String, //distance
            qty: Number,
            availability : {type :Boolean, default: true } // this is for allocation purposes
        }]
    }]
});

LogSchema.plugin(findOrCreate);

LogSchema.method('mergeFetchData', function(dateObj) {
    var log = this;
    var loggedDates = _.keys(dateObj);

    _.forEach(loggedDates, function(dateString) {
        var newDate = new Date(dateString);

        var dateIndex = _.findIndex(log.logData, function(userLogItem) {
            return userLogItem.date.getTime() === newDate.getTime();
        });

        if (dateIndex === -1) {
            log.logData.push({
                date : newDate,
                metrics : dateObj[dateString].metrics
            });
        } else {
            log.logData[dateIndex].metrics = dateObj[dateString].metrics;

            _.forEach(dateObj[dateString].metrics, function(fetchedDataMetric) {

                var matchedMetric = _.find(log.logData[dateIndex].metrics, function(userDataMetric) {
                    return userDataMetric.measurement === fetchedDataMetric.measurement;
                });

                if (matchedMetric) {
                    matchedMetric.qty = fetchedDataMetric.qty;
                } else {
                    log.logData[dateIndex].metrics.push(fetchedDataMetric);
                }
            });
        }
    });


    return new Promise(function(resolve, reject) {
        log.save(function(err, savedLog) {
            if (err) {
                reject(err);
            } else {
                resolve(savedLog);
            }
        });
    });
});

mongoose.model('Logs', LogSchema);