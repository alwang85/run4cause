'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    category: {type: String},
    name: {type: String},
    sources: [{
        name: String,
        apiRef: {type: mongoose.Schema.Types.ObjectId, ref: 'API'}
    }]
});

mongoose.model('Metric', schema);
