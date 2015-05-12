'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    metric: String,
    category: {type: String, enum:['avg', 'total','frq']},
    goal: Number,
    description: String,
    name: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});


mongoose.model('Challenge', schema);