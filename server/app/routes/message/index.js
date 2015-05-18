'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var Message = require('mongoose').model('Message');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var deepPopulate = require('mongoose-deep-populate');

router.post('/', function (req,res,next){
  var body = req.body;
  body.timestamp = new Date;
  body.sender = req.user._id;
  User.findOne({email: req.body.recipient.email}, function(err, foundRecipient){
    body.recipient = foundRecipient._id;
    Message.create(body, function(err, savedMessage){
      if (err) next(err);
      console.log('message created', savedMessage);
      res.send('success');
    });
  });

});

router.get('/:userId', function (req,res,next){
  console.log('getting user messages');
  Message.find({$or: [{recipient: req.params.userId},{sender: req.params.userId}] }).deepPopulate('recipient sender').exec(function (err, messages){
    res.send(messages);
  });
});

