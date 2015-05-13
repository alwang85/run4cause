'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    active : {type: [String], default: []},
    firstName : String,
    lastName  : String,
    joinedTime : { type: Date, default : Date.now }, // might be needed to get the initial batch of logs
    lastLogUpdate : {type: Date, default : Date.now },
    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    jawbone: {
        token : String,
        refresh_token : String,
        expires_in : Number
    },
    fitbit: {
        token: String,
        refresh_token : String,
        expires_in : Number
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'newEvent'}],
    log: [{
      date: Date,
      metrics: [{
        measurement: String, //distance
        qty: Number
      }]
    }]
});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }
    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;
schema.statics.findByIdAndHandleLinkDeviceCallback = require('./findByIdAndHandleLinkDeviceCallback');

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

schema.method('refreshTokens', require('./refreshTokens'));
schema.method('parseData', require('./parseData'));
schema.method('updateLogs', require('./updateLogs'));

mongoose.model('User', schema);