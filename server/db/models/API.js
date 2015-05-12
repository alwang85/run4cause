'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');

var schema = new mongoose.Schema({
    source: String,
    metrics: [{
        name: String,
        route: String,
        apiRoute: String
    }]
});

schema.statics.findBySourcesAndChangeDuration = function(query, lastLogUpdate) {
    var model = this;
    var startTime = lastLogUpdate;
    var endTime   = new Date();
    var startEpoch = Math.round(Date.parse(startTime.toISOString().slice(0,10))/1000);
    var endEpoch = Math.round(Date.parse(endTime.toISOString().slice(0,10))/1000);

    return new Promise(function(resolve, reject) {
        model.find(query, function(err, sources) {
            if (err) return reject(err);

            var updatedSources = [];

            updatedSources = _.map(sources, function(src) {
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
            console.log(updatedSources);

            resolve(updatedSources);
        });
    });
};

mongoose.model('API', schema);