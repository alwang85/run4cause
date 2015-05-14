'use strict';
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');
var deepPopulate = require('mongoose-deep-populate');
var async = require('async');
var _ = require('lodash');
var moment = require('moment-range');
var schema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    category: Number,
    progress: Number,
    group: Boolean,
    contest: Boolean,
    goals: [{
        metrics : {
            measurement: String,
            target: Number,
            progress: Number
        },
        category: {type: String, enum:['avg', 'total','frq']}
    }],
    challengers: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        individualProgress: Number
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    nonProfit: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Nonprofit'
    },
    description: String,
    name: String
});
schema.plugin(deepPopulate);

schema.methods.calculateProgress = function(cb) {
    var that = this;
    var totalProgressObj = {};
    async.forEach(that.challengers, function(challenger, done){
        var results =[];
        var range1 = moment().range(that.startDate, that.endDate);
        range1.by('days', function(day) {
            var tempResults = _.find(challenger.user.log, function(userLog) {
                return moment(userLog.date).toString() == day.toString();
            });
            if (tempResults){
                results.push(tempResults);
            }
        });
        var progressObj = {};
        _.forEach(results, function(eachDayLog) {
            _.forEach(eachDayLog.metrics, function (eachMetric) {
                _.forEach(that.goals, function(goal){
                    if(goal.metrics.measurement === eachMetric.measurement){
                        if(!progressObj[goal.metrics.measurement]) progressObj[goal.metrics.measurement] = 0;
                        progressObj[goal.metrics.measurement] += (eachMetric.qty/goal.metrics.target);
                    }
                })
            })
        });
        var total = 0;
        for(var key in progressObj){
            total += progressObj[key];
            if(!totalProgressObj[key]) totalProgressObj[key] = 0;
            totalProgressObj[key] += progressObj[key];
        }

        challenger.individualProgress = ((total/(Object.keys(progressObj).length)) || 0);
        done();
    }, function(err){
            var totalProgress = 0;
        _.map(that.goals, function(eachGoal){
            for(var key in totalProgressObj){
                if(key===eachGoal.metrics.measurement) {
                    eachGoal.metrics.progress = totalProgressObj[key];
                    totalProgress += (eachGoal.metrics.progress)/(Object.keys(totalProgressObj).length)
                }
            }
            return eachGoal;
        });
        that.progress = totalProgress;
        that.save();
        return cb(null, that);
    });
};

mongoose.model('newEvent', schema);