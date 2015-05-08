'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    steps: {
        goal: Number
    },
    calories: {
        type: Number
    },
    distance: {
        type: Number
    },
    sleep: {
        type: Number
    }
});


mongoose.model('Strategy', schema);