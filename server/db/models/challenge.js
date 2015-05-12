'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var moment = require('moment-range');
var Metric = require('mongoose').model('Metric');
var async = require('async');

var schema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    progress: Number,
    description: String,
    name: String,
    goals: [{
        metric: String,
        category: {type: String, enum:['avg', 'total','frq']},
        target: Number
    }],
    challengers: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        individualProgress: {
            sleep: Number,
            distance: Number,
            steps: Number,
            calories: Number
        }
    }]
});

//

schema.methods.calculateProgress = function(cb) {
  //console.log('in method');
  //console.log(user);
    var progress = 0;
    var that = this;
    async.forEach(that.challengers, function(challenger, done){
            var results =[];
            var range1 = moment().range(that.startDate, that.endDate);
            range1.by('days', function(day) {
                //console.log('before user.log');
                //console.log(user.log);
                var tempResults = _.find(challenger.user.log, function(userLog) {
                    return moment(userLog.date).toString() == day.toString();
                });
                if (tempResults){
                    results.push(tempResults);
                }
            });
        _.forEach(results, function(eachDayLog) {
            _.forEach(eachDayLog, function (eachDay) {
                for (var metric in challenger.individualProgress) {
                    if (metric === eachDay.metrics.measurement) {
                        challenger.individualProgress[metric] += eachDay.metrics.qty
                    }
                }
            })
        });
        done();
    }, function(err){
        that.save();
        return cb(null, that);
    });
};

mongoose.model('Challenge', schema);
