'use strict';
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');
var deepPopulate = require('mongoose-deep-populate');
var async = require('async');
var schema = new mongoose.Schema({
    category: Number,
    group: Boolean,
    contest: Boolean,
    goal: Number, //overall goal
    challenges: [
      {
        challenge: {type: mongoose.Schema.Types.ObjectId, ref: 'Challenge'},
        goal: Number,
        progress: Number
      }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    challengers: [{
        user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        join: Date
    }],
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



schema.methods.calculateProgress = function(cb) {
  // the Page model (represents collections!) doesn't exist until we build it from the schema… but we are writing the schema before we build the model! How can we access the collection then? One way is to ask for this instance's constructor. When this function is called, the constructor will be the model that built this instance.
  var newEvent = this;
  var progress;
  async.forEachLimit(newEvent.challenges, 1, function(challenge, done){
    if (newEvent.category == '1'){
      progress = 0;
      async.forEachLimit(newEvent.challengers, 1, function(user, done){
        challenge.challenge.calculateProgress(user.user, function(err, userProgress){
          //console.log('here is the user progress', userProgress);
          progress += Number(userProgress);
          done();
        })
      }, function(err){
        challenge.challenge.progress = progress;
        //console.log('this should be somewhere', challenge.challenge.progress);
        challenge.challenge.save(function(err, data){
          if (err) console.log(err)
          //console.log('saved challenge progress', data);
        });
        done();
      })

    } //TODO add logic for users
  }, function(err){
    return cb(null, newEvent);
  });




  // above, note that we simply call the callback given to us by the user of this function. "Let them decide what to do with the pages".
};




mongoose.model('newEvent', schema);