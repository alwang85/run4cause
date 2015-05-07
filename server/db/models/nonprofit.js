'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  url: {
    type: String
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
});


mongoose.model('Nonprofit', schema);