'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    source: String,
    metrics: [{
        name: String,
        route: String
    }]
});


mongoose.model('API', schema);