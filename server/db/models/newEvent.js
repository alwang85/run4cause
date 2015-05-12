'use strict';
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');
var deepPopulate = require('mongoose-deep-populate');
var async = require('async');
var schema = new mongoose.Schema({
    category: Number,
    group: Boolean,
    contest: Boolean,
    challenge: {type: mongoose.Schema.Types.ObjectId, ref: 'Challenge'},
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    nonProfit: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Nonprofit'
    },
    description: String,
    name: String
});
schema.plugin(deepPopulate);



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