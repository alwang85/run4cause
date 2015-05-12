'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var moment = require('moment-range');
var Metric = require('mongoose').model('Metric');

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

schema.methods.calculateProgress = function(user, cb) {
  //console.log('in method');
  //console.log(user);
    var progress = 0;

    var challengeMetric = this.metric;
    var that = this;
    return Metric.findById(challengeMetric).exec().then(function(theMetric){
      var results =[];
      //console.log('startDate: ', that.startDate);
      //console.log('endDate: ', that.endDate);
      var range1 = moment().range(that.startDate, that.endDate);
      range1.by('days', function(day) {
        //console.log('before user.log');
        //console.log(user.log);
        var tempResults = _.find(user.log, function(userLog) {
          return moment(userLog.date).toString() == day.toString();
        });
        if (tempResults){
          results.push(tempResults);
        }
      });
      //console.log('results dates', results);
      results.forEach(function(dayResults){
        var tempMetric = _.find(dayResults.metrics, function(metric) {
          return metric.measurement == theMetric.name; //need to refactor once metric seeds properly
        });
        if (tempMetric){
          progress += tempMetric.qty;
        }
      });
      //console.log('end progress', progress);
      return cb(null, progress);
    })

};

mongoose.model('Challenge', schema);
