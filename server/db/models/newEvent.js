'use strict';
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');

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




schema.methods.calculateProgress = function(cb) {
  // the Page model (represents collections!) doesn't exist until we build it from the schema… but we are writing the schema before we build the model! How can we access the collection then? One way is to ask for this instance's constructor. When this function is called, the constructor will be the model that built this instance.
  var newEvent = this.constructor;
  var progress;
  newEvent.challenges.forEach(function(challenge){
    if (newEvent.category == '1'){
      progress = 0;
      this.challengers.forEach(function(user){
        challenge.calculateProgress(user, function(userProgress){
          progress += userProgress;
        })
      })
      challenge.progress = progress;
    } //TODO add logic for users
    else if (newEvent.category == '2') {
      challenge.progress = challengers.count;
    }
  }, function callback(){
    newEvent.save();
  });

  // above, note that we simply call the callback given to us by the user of this function. "Let them decide what to do with the pages".
};




mongoose.model('newEvent', schema);