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
    sponsor: {
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      details: {
        '0': {type: Number, default: 0},
        '25': {type: Number, default: 0},
        '50': {type: Number, default: 0},
        '75': {type: Number, default: 0},
        '100': {type: Number, default: 0}
      }
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
                results = logs.logData;
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
         });
     });
    });
    User.findOne({email: 'admin@admin.com'}, function(err, foundUser) {
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
        var message = {};
        if (totalProgress >= 1 && that.status !== 'achieved' && that.sponsor && that.sponsor.length >= 1 && foundUser && foundUser._id) {
          console.log('totalProgress', totalProgress >= 1);
          console.log('that.status', that.status !== 'achieved');
          console.log('that.sponsor', that.sponsor);
          console.log('that.sponsor.length', that.sponsor.length >= 1);
          console.log('foundUser', foundUser);
          console.log('foundUser._id', foundUser._id);
          async.forEach(that.sponsor, function (sponsor, done) {
            message.recipient = sponsor.user;
            message.sender = foundUser._id;
            message.title = 'The event goals you sponsored have been reached!';
            message.content = 'Hello ' + foundUser.firstName + ', the event you sponsored has ended! ' + that.challengers.length + 'challengers worked ferociously to meet the criteria you have set. Please click here to view the details on event, and then proceed to the patients page to fulfill your promise!';
            message.date = new Date;
            Message.create(message, function (err, savedMessage) {
              done();
            });

          }, function (err) {
            if (err) {
              console.log('error', err);
              next()
            }
            that.status = 'achieved';
            that.save();
            return that;
          });
        } else {
          that.save();
          return that;
        }
      });//ends Promise.all
    });//ends User.findOne
};

mongoose.model('Event', schema);