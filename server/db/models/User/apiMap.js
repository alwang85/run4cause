var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment-range');
moment().format();

module.exports = {
    fitbit: {
        adapt: fitbitAdapt,
        collect: fitbitCollect,
        getQueryString: fitbitQueryStr
    },
    jawbone:  {
        adapt : jawboneAdapt,
        collect : jawboneCollect,
        getQueryString : jawboneQueryStr
    }
}

function collectIterate (results, cb) {
    return _.chain(results)
        .map(function(item) {
            console.log(item[1]);
            var json;
            try {
                json = JSON.parse(item[1]);
            } catch (e) {
                throw e;
            }
            return json;
        })
        .reduce(function(objResult, jsonParsedItem) {
            return cb(objResult, jsonParsedItem);
        }, {})
        .value();
}

function fitbitAdapt(provider,logItem){
    var dateObj = this;
    var date, value;
    var fitbitMap = {
        "activities-tracker-distance" : "distance",
        "activities-tracker-steps"    : "steps",
        "sleep-minutesAsleep"         : "sleep",
        "activities-tracker-calories" : "calories"
    };

    var fitbitObj = logItem;

    _.forIn(fitbitMap, function(metricValue, metricKey) {
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

    return dateObj;
}

function fitbitCollect(results) {
    return collectIterate(results, function(objResult, jsonParsedItem) {
        return _.merge(objResult, jsonParsedItem);
    });
};

function fitbitQueryStr(startTime, endTime) {
    var duration = moment.duration(endTime.diff(startTime));
    var queryString = '';

    if (duration.asHours() <= 24) {
        queryString = '/' + endTime.format('YYYY-MM-DD') + ".json";
    } else {
        var startTimeString = startTime.format('YYYY-MM-DD');
        var endTimeString = endTime.format('YYYY-MM-DD');

        queryString = "/"+startTimeString+"/"+endTimeString+".json";
    }
    return queryString;
}

function jawboneAdapt(provider, logItem){
    var dateObj = this;
    var date;
    var jawboneItems = logItem.items;

    _.forEach(jawboneItems, function(item) {
        if (!item) return;
        if (!item.date) {
            throw new Error("no date specified");
        }

        date = moment(item.date.toString(), 'YYYYMMDD').format('YYYY-MM-DD');
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

    return dateObj;
}

function jawboneCollect(results) {
    return collectIterate(results, function(objResult, jsonParsedItem) {
        objResult.items = objResult.items ? objResult.items : [];
        objResult.items = objResult.items.concat(jsonParsedItem.data.items);
        return objResult;
    });
}

function jawboneQueryStr(startTime, endTime) {
    var duration = moment.duration(endTime.diff(startTime));
    var queryString = '';
    if (duration.asHours() <= 24) {
        //queryString = "/?date=" + endTime.format('YYYYMMDD');
    } else {
        var startEpoch = startTime.hour(0).minute(0).second(0).format('X');
        var endEpoch = endTime.format('X');
        queryString = "?start_time=" + startEpoch + "&end_time=" + endEpoch;
    }

    console.log(queryString);
    return queryString;
}