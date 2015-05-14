// collecting all activities from all devices
var Promise = require('bluebird');
var _ = require('lodash');
var APImap = require('./apiMap');

// this maps out the fetched data and extract only the
// information we want
module.exports = function(result) {
    var dateObj = {};

    // sanitizing fetched data
    _.forEach(result, function(logItem) {
        var provider = Object.keys(logItem)[0];

        APImap[provider].adapt.call(dateObj, provider, logItem[provider]);
    });

    var user = this;

    // get the user's log first
    return user.getUserLogs()
    .then(function(log) {
        return log.mergeFetchData(dateObj);
    });
};