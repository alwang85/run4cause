'use strict';
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var _ = require('lodash');
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

mongoose.model('Message', schema);