var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    fitbit: function(provider,logItem, dateObj){

        var date, value;
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
    },

    jawbone: function(provider, logItem, dateObj){

        var date, value;
        var jawboneItems = logItem[provider].items;

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