'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

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
  }]
});

schema.plugin(deepPopulate);

schema.virtual('events').get(function() {
    //var nonProfitId
});


mongoose.model('Nonprofit', schema);