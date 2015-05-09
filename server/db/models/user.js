'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

var schema = new mongoose.Schema({
    active : {type: [String], default: []},
    firstName : String,
    lastName  : String,
    joinedTime : { type: Date, default : Date.now },
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
        id : String,
        token : String
    },
    fitbit: {
        id: String,
        token: String,
        expires_in : Number
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
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

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

schema.method('updateLogs', function(cb) {
    var promises = [];

    var activeDevices = this.active;

    promises = _.map(activeDevices, function(provider) {
        return request({
            method : 'GET'
        })
    });

    return cb(this.active);
});

mongoose.model('User', schema);