var Promise = require('bluebird');
var moment = require('moment-range');
var _ = require('lodash');

module.exports = function(startDate, endDate) {
    var user = this;
    var query = {
        user : user
    };

    return new Promise (function(resolve, reject) {
        user.model('Logs').findOrCreate(query, query, function(err, log) {
            if (err) {
                reject(err);
            }
            else {
                resolve(log);
            }
        });
    });
};