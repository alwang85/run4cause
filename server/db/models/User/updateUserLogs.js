var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var _ = require('lodash');
var moment = require('moment-range');
var APImap = require('./apiMap');
moment().format();

var findBySourcesAndChangeDuration = function(activeDevices, lastLogUpdate) {
    // grabbing api routes
    var sources = require('./apiRoutes')(activeDevices);

    // TODO: use moment js
    var startTime = moment(lastLogUpdate.toISOString());
    var endTime = moment();

    var updatedSources = _.map(sources, function(src) {
        var queryString =  APImap[src.source].getQueryString(startTime, endTime);

        _.forEach(src.metrics, function(metric) {
            metric.apiRoute = metric.apiRoute + queryString;
        });

        return src;
    });

    return updatedSources;
};

module.exports = function() {
    var user = this;
    var activeDevices = user.active;

    var apis = findBySourcesAndChangeDuration(activeDevices, user.lastLogUpdate );

    var allRequests = _.map(apis, function(provider) {

        var tokenHeader = {
            Authorization : 'Bearer ' + user[provider.source].token
        };

        var promises = [];

        _.forEach(provider.metrics, function(api) {
            promises.push(request.getAsync({
                url : api.apiRoute,
                headers : tokenHeader
            }));
        });

        return Promise
        .all(promises)
        .then(function(results) {
            results = APImap[provider.source].collect(results);

            var returnObj = {};
            returnObj[provider.source] = results;
            return returnObj;
        });
    });

    return Promise.all(allRequests)
    .then(function(results) {
        return user.parseLogData(results);
    })
    .then(function(log) {
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
    });
};