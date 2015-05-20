'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var schema = new mongoose.Schema({
    active : {type: [String], default: []},
    firstName : String,
    lastName  : String,
    joinedTime : { type: Date, default : Date.now }, // might be needed to get the initial batch of logs
    lastLogUpdate : {type: Date },
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
    profile : String,
    username: String
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
schema.method('parseLogData', require('./parseLogData'));
schema.method('updateUserLogs', require('./updateUserLogs'));
schema.method('getUserLogs', require('./getUserLogs'));

schema.method('getUserEvents', function() {
    var user = this;
    return new Promise(function(resolve, reject) {
        user.model('Event').find({
            challengers : {
                '$elemMatch' : { user : user._id }
            },
            status : 'Active'
        }).select('creator').exec(function(err, events) {
            if (err) return reject(err);

            resolve(events);
        });
    });
});

mongoose.model('User', schema);