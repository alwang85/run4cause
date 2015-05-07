'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    type: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    strategy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Strategy'
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
    }
});


mongoose.model('Event', schema);