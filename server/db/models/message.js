'use strict';
var mongoose = require('mongoose');
var User = require('mongoose').model('User');
var deepPopulate = require('mongoose-deep-populate');
var _ = require('lodash');
var async = require('async');


var schema = new mongoose.Schema({
  timestamp: Date,
  sender: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  title: String,
  content: String,
  read: {type: Boolean, default: false}
});
schema.plugin(deepPopulate);



schema.statics.messageSponsors = function (event, sender, title, content, cb){
    var that = this;
    if (event.progress >= 1 && event.status !== 'achieved' && event.sponsors && event.sponsors.length >= 1) {
      async.forEach(event.sponsors, function (sponsor, done) {
        User.findById(sponsor.user, function(err, foundSponsor){
          console.log('foundSponsor', foundSponsor);
          var message = new that();
          message.recipient = sponsor.user;
          message.sender = sender;
          message.title = title;
          message.content = 'Hello ' + foundSponsor.email + ', ' + content;
          message.content = message.content.replace('REPLACETOKEN', event.patient.token).replace('REPLACEAMOUNT', sponsor.details['100']);
          message.date = new Date;
          message.save(function(err, saved){
            done();
          })
        })

      }, function (err) {
        if (err) {
          console.log('error in messaging sponsors', err);
          next()
        }
        event.status = 'achieved';
        event.save();
        cb(err, event);
      });
    } else {
      event.save();
      cb(null, event);
    }
};
schema.statics.eventSuccess = function (event, cb){
  var that = this;
  User.findOne({email: 'admin@impactmission.io'}, function(err, foundUser) {
    //console.log('found admin in eventSuccess', foundUser);
    var sender = foundUser._id;
    var title = 'The event goals you sponsored have been reached!';
    var content = 'the event you sponsored has ended! Please click %3Ca%20href%3D%22https%3A//watsi.org/profile/REPLACETOKEN%22%20%3Ehere%3C/a%3E to proceed to the patients page to fulfill your promise of $REPLACEAMOUNT for the cause!';
    that.messageSponsors(event, sender, title, content, cb);
  });
};
//schema.statics.messageChallengers = function (eventId, sender, title, content, cb){
//  abc;
//};










































mongoose.model('Message', schema);

