'use strict';
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var async = require('async');
var _ = require('lodash');
var moment = require('moment-range');
var Promise = require('bluebird');
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
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    challengers: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        individualProgress: Number
    }],
    nonProfit: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Nonprofit'
    },
    description: String,
    name: String
});
schema.plugin(deepPopulate);

schema.methods.calculateProgress = function() {
    var that = this;
    var totalProgressObj = {};
    var promises = _.map(that.challengers, function(challenger){
        return new Promise(function(resolve,reject){
            var results = [];
            challenger.user.getUserLogs(that.startDate, that.endDate).then(function(logs){
                results = logs;
                console.log(results);
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
                resolve(challenger);
         })
     });
    });

    return Promise.all(promises).then(function(){
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

        that.save(function(err,savedThat){

        });
        console.log(that);
        return that;
    });
};

mongoose.model('newEvent', schema);