'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    category: Number,
    group: Boolean,
    contest: Boolean,
    progress: Number,
    goal: Number,
    challenges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Challenge'}],
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


mongoose.model('newEvent', schema);