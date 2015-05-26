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
    patient: {
      name: String,
      token: String,
      profilePic: String
    },
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
    sponsors: [{
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

    // mapping through each challengers
    var promises = _.map(that.challengers, function(challenger){
        return new Promise(function(resolve,reject){
            var results = [];

            // getting user logs for each challenger
            if (!challenger.user.getUserLogs) return resolve(challenger);

            challenger.user.getUserLogs(that.startDate, that.endDate).then(function(logs){
                if (logs) {
                    results = logs.logData;
                    var progressObj = {};
                    // for each log data
                    _.forEach(results, function(eachDayLog) {
                        // for each metrics array
                        _.forEach(eachDayLog.metrics, function (eachMetric) {
                            // for each event's goals, match metric array
                            // TODO use eachMetric.availability to set/check the availability of this metric
                            // TODO availability should depend on whether this challenger has joined and allocated his/her data already

                            if (!eachMetric.availability || eachMetric.availability.toString() === that._id.toString()) {
                                _.forEach(that.goals, function(goal){
                                    if(goal.metrics.measurement === eachMetric.measurement){
                                        if(!progressObj[goal.metrics.measurement])
                                            progressObj[goal.metrics.measurement] = 0;
                                        if(goal.metrics.measurement === 'distance')
                                            progressObj[goal.metrics.measurement] += Math.min.call(null, eachMetric.qty/(goal.metrics.target*1609.34), 1);
                                        else
                                            progressObj[goal.metrics.measurement] += Math.min.call(null, eachMetric.qty/goal.metrics.target, 1)

                                        eachMetric.availability = that._id;
                                    }
                                });
                            }
                        });
                    });
                    var total = 0;

                    for(var key in progressObj){
                        total += progressObj[key];
                        if(!totalProgressObj[key]) totalProgressObj[key] = 0;
                        totalProgressObj[key] += progressObj[key];
                    }
                    challenger.individualProgress = ((total/(Object.keys(progressObj).length)) || 0);

                    that.model('Logs').findByIdAndUpdate(logs._id, logs, function(err, savedLog) {
                        resolve(challenger);
                    });
                } else {
                    resolve(challenger);
                }
         }).catch(function(err){
                reject(err);
            });
     });
    });
      return Promise.all(promises).then(function () {
          //console.log('totlaprogressobj',totalProgressObj);
        var totalProgress = 0;
        var updatedGoals = _.map(that.goals, function (eachGoal) {
            if(Object.keys(totalProgressObj).length){
                for (var key in totalProgressObj) {
                    if (key === eachGoal.metrics.measurement) {
                        eachGoal.metrics.progress = Math.min.call(null, totalProgressObj[key], 1);
                        totalProgress += (eachGoal.metrics.progress) / (Object.keys(totalProgressObj).length);
                    }
                }
                return eachGoal;
            } else {
                eachGoal.metrics.progress = 0;
                return eachGoal;
            }

        });
          //console.log('updated goals', updatedGoals)
        that.goals = updatedGoals;
        that.progress = totalProgress;
        that.save(function(err, savedEvent){
          Message.eventSuccess(savedEvent, function(err, emailedEvent){
            return emailedEvent;
          });
        });
      });//ends Promise.all
};

schema.statics.calculateProgressAll = function(cb){
  var that = this;
  that.find({}).sort({startDate: -1}).deepPopulate('creator challengers.user nonProfit sponsors.user').exec(function (err, events) {
         if (err) return next(err);
         var promises = events.map(function (eachEvent) {
           return new Promise(function (resolve, reject) {
             resolve(eachEvent.calculateProgress());
           });
         });

         return Promise.all(promises).then(function () {
           cb(null, events);
         }).catch(function(err){
           console.log('err in calcAll', err);
         })
     });
}

mongoose.model('Event', schema);