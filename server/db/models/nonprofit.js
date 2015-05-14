'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var _ = require("lodash");
var Promise = require('bluebird');

var schemaOptions = {
  toJSON : {
    virtuals : true
  },
  toObject : {
    virtuals : true
  }
};

var schema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  url: {
    type: String
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }]
}, schemaOptions);

schema.plugin(deepPopulate);

schema.statics.getEveryNonProfitEvents = function(cb) {
    var Nonprofit = this;

    return Nonprofit.find({}).exec()
    .then(function(nonProfits) {
        var promises = _.map(nonProfits, function(np) {
            return np.getEvents().then(function(events) {
                np = np.toObject();
                np.events = events;

                var pop = _.reduce(events, function(popularity, event) {
                    popularity += event.challengers.length;
                    return popularity;
                }, 0);

                np.popularity = pop;
                return np;
            });
        });

        return Promise.all(promises).then(function(populatedNP) {
            cb(null, populatedNP);
        }).catch(cb);
    });

};

schema.method("getEvents", function() {
    var np = this;
    return this.model("newEvent").find({
        nonProfit : np._id
    }).exec();
});


mongoose.model('Nonprofit', schema);