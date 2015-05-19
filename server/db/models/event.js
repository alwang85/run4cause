'use strict';
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var async = require('async');
var _ = require('lodash');
var moment = require('moment-range');
var Message = require('mongoose').model('Message');
var User = require('mongoose').model('User');
var Promise = require('bluebird');
var schema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    progress: Number,
    patient: {},
    group: Boolean,
    status: {
      type: String,
      default: 'Active'
    },
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
<<<<<<< HEAD
    sponsor: [{
=======
    sponsors: [{
>>>>>>> master
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      details: {
        '0': {type: Number, default: 0},
        '25': {type: Number, default: 0},
        '50': {type: Number, default: 0},
        '75': {type: Number, default: 0},
        '100': {type: Number, default: 0}
      }
    }],
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
                results = logs.logData;
                var progressObj = {};
                _.forEach(results, function(eachDayLog) {
                    _.forEach(eachDayLog.metrics, function (eachMetric) {
                        _.forEach(that.goals, function(goal){
                            if(goal.metrics.measurement === eachMetric.measurement){
                                if(!progressObj[goal.metrics.measurement]) progressObj[goal.metrics.measurement] = 0;
                                progressObj[goal.metrics.measurement] += (eachMetric.qty/(goal.metrics.target*1609.34));
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
         });
     });
    });
      return Promise.all(promises).then(function () {
        var totalProgress = 0;
        _.map(that.goals, function (eachGoal) {
          for (var key in totalProgressObj) {
            if (key === eachGoal.metrics.measurement) {
              eachGoal.metrics.progress = totalProgressObj[key];
              totalProgress += (eachGoal.metrics.progress) / (Object.keys(totalProgressObj).length)
            }
          }
          return eachGoal;
        });
        that.progress = totalProgress;
        that.save(function(err, savedEvent){
          Message.eventSuccess(savedEvent, function(err, emailedEvent){
            return emailedEvent;
          });
        });
      });//ends Promise.all
};

mongoose.model('Event', schema);