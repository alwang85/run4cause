var Promise = require('bluebird');
var moment = require('moment-range');
var _ = require('lodash');

module.exports = function(startDate, endDate) {
    var user = this;
    var query = {
        user : user._id
    };

    return new Promise (function(resolve, reject) {
        user.model('Logs').findOrCreate(query, query, function(err, log) {
            if (err) {
                reject(err);
            }
            else {
                if (startDate) {
                    endDate = endDate || moment();

                    var range = moment().range(startDate, endDate);
                    var querylogs = []
                    range.by('days', function(moment) {
                        var inRangeLogData = _.find(log.logData, function(logData) {
                            return moment.isSame(logData.date);
                        });

                        if (inRangeLogData) {
                            querylogs.push(inRangeLogData);
                        }
                    });

                    log = log.toObject();
                    log.logData = querylogs;
                }

                resolve(log);
            }
        });
    });
};