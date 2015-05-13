var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var _ = require('lodash');

var findBySourcesAndChangeDuration = function(activeDevices, lastLogUpdate) {
    // grabbing api routes
    var sources = require('./apiRoutes')(activeDevices);

    // TODO: use moment js
    var startTime = lastLogUpdate;
    var regex = new RegExp("([0-9]+:[0-9]+:[0-9]+)", "g");
    var startTimeString = startTime.toString().replace(regex, "00:00:00");
    var endTime = new Date();
    var startEpoch = Date.parse(startTimeString)/1000;
    var endEpoch = endTime.getTime()/1000;
    var updatedSources = _.map(sources, function(src) {
        var queryString = '';
        if (src.source === 'jawbone') {
            if (endEpoch - startEpoch <= 60 * 60 * 24) {
                queryString = "?date=" + startTime.toISOString().slice(0,10).replace(/-/g,"");
            } else {
                queryString = "?start_time=" + startEpoch + "&end_time=" + endEpoch;
            }
        }

        if (src.source === 'fitbit') {
            if (endEpoch - startEpoch <= 60 * 60 * 24) {
                queryString = "/today/1d.json";
            } else {
                var startTimeString = startTime.toISOString().slice(0,10);
                var endTimeString = endTime.toISOString().slice(0,10);

                queryString = "/"+startTimeString+"/"+endTimeString+".json";
            }
        }
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
            console.log("fetched data", results);
            results = _.chain(results)
                .map(function(item) {
                    return JSON.parse(item[1]);
                })
                .reduce(function(objResult, jsonParsedItem) {
                    if(provider.source === 'fitbit'){
                        return _.merge(objResult, jsonParsedItem)
                    }

                    if(provider.source === 'jawbone'){
                        objResult.items = objResult.items ? objResult.items : [];
                        objResult.items = objResult.items.concat(jsonParsedItem.data.items);
                        return objResult;
                    }
                }, {})
                .value();

            var returnObj = {};
            returnObj[provider.source] = results;
            return returnObj;
        });
    });

    return Promise.all(allRequests)
    .then(function(results) {
        return user.parseData(results);
    });
};