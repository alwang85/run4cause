var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var _ = require('lodash');

module.exports = function() {
    var user = this;
    var activeDevices = user.active;

    var findPromise = user.model('API').findBySourcesAndChangeDuration(
        {source : {$in : activeDevices}},
        user.lastLogUpdate //Actual Data
    );

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
                        headers : tokenHeader
                    }));
                });

                return Promise.all(promises)
                    .then(function(results) {

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
                        console.log(results.data);
                        return returnObj;
                    });
            });

            return Promise.all(allRequests);
        })
        .then(function(results) {
            return user.parseData(results);
        });
};