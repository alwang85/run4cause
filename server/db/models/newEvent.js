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
            target: Number
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
    //console.log('in method');
    //console.log(user);
    var that = this;
    async.forEach(that.challengers, function(challenger, done){
        var results =[];
        var range1 = moment().range(that.startDate, that.endDate);
        range1.by('days', function(day) {
            //console.log('before user.log');
            var tempResults = _.find(challenger.user.log, function(userLog) {
                //console.log('this is results', userLog.date, day.toString());
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
        console.log('this is obj', progressObj);
        var total = 0;
        for(var key in progressObj){
            total += progressObj[key];
        }
        challenger.individualProgress = total/(Object.keys(progressObj).length);
        done();
    }, function(err){
        that.save();
        return cb(null, that);
    });
};

//schema.methods.calculateProgress = function(cb) {//for each user in an event, sums the progress for each user for each challenge
//  var newEvent = this;
//  var progress;
//  async.forEachLimit(newEvent.challenges, 1, function(challenge, done){
//    if (newEvent.category == '1'){
//      progress = 0;
//      async.forEachLimit(newEvent.challengers, 1, function(user, done){
//        challenge.challenge.calculateProgress(user.user, function(err, userProgress){
//          //console.log('here is the user progress', userProgress);
//          progress += Number(userProgress);
//          done();
//        })
//      }, function(err){
//        challenge.challenge.progress = progress;
//        //console.log('this should be somewhere', challenge.challenge.progress);
//        challenge.challenge.save(function(err, data){
//          if (err) console.log(err)
//          //console.log('saved challenge progress', data);
//        });
//        done();
//      })
//
//    } //TODO add logic for users
//  }, function(err){
//    return cb(null, newEvent);
//  });
//
//};




mongoose.model('newEvent', schema);