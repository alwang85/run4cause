/*

 This seed file is only a placeholder. It should be expanded and altered
 to fit the development of your application.

 It uses the same file the server uses to establish
 the database connection:
 --- server/db/index.js

 The name of the database used is set in your environment files:
 --- server/env/*

 This seed file has a safety check to see if you already have users
 in the database. If you are developing multiple applications with the
 fsg scaffolding, keep in mind that fsg always uses the same database
 name in the environment files.

 Refer to the q documentation for why and how q.invoke is used.

 */

var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Nonprofit = mongoose.model('Nonprofit');
var Event = mongoose.model('Event');




var q = require('q');
var chalk = require('chalk');

var getCurrentUserData = function () {
    return q.ninvoke(User, 'find', {});
};

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password',
            lastLogDate: new Date((new Date()).getTime() - 4*24*60*60*1000)
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',
            lastLogDate: new Date((new Date()).getTime() - 4*24*60*60*1000)
        }

    ];
    return q.invoke(User, 'create', users);

};

var seedNonProfit = function() {
    return User.find({}).exec()
        .then(function(users) {
            var nonprofits = [{
                creator     : users[0]._id,
                name        : "Non Profit 1",
                description : "Non Profit Description",
                url         : "http://nonprofit1.com",
                followers   : users
            },
                {
                    creator     : users[0]._id,
                    name        : "Non Profit 2",
                    description : "Non Profit Description",
                    url         : "http://nonprofit1.com",
                    followers   : []
                }];

            return q.invoke(Nonprofit, 'create', nonprofits);
        });
};




var seedEvents = function(nonprofits){
  return User.find({}).exec()
    .then(function(users) {
      //console.log('users inside new seed events', users);
      var Events = [{
        category: 1,
        group: true,
        contest: false,
        progress: 0,
        goals:[{
            metrics: {
                measurement: 'sleep',
                target: 33,
                progress: 0
            },
            category: 'total'
        },{
            metrics: {
                measurement: 'distance',
                target: 55,
                progress: 0
            },
            category: 'total'
        }],
        creator: users[0],
        challengers: [{
            user: users[0],
            individualProgress: 0
        },{
            user: users[1],
            individualProgress: 0
        }],
        startDate: new Date('2015-05-11'),
        endDate: new Date('2015-05-18'),
        nonProfit: nonprofits,
        description: "Lets walk lots of miles.",
        name: "Walk."
      },
      {
          category: 1,
          group: true,
          contest: false,
          progress: 0,
          goals:[{
              metrics: {
                  measurement: 'sleep',
                  target: 70,
                  progress: 0
              },
              category: 'total'
          },{
              metrics: {
                  measurement: 'distance',
                  target: 90,
                  progress: 0
              },
              category: 'total'
          },
          {
              metrics: {
                  measurement: 'steps',
                  target: 3000,
                  progress: 0
              },
              category: 'total'
          }],
          creator: users[0],
          challengers: [{
              user: users[0],
              individualProgress: 0
          },{
              user: users[1],
              individualProgress: 0
          }],
          startDate: new Date('2015-05-11'),
          endDate: new Date('2015-05-18'),
          nonProfit: nonprofits,
          description: "many things",
          name: "Walk Sleep."
      }
      ];
      return q.invoke(Event, 'create', Events);
    });
};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
      console.log('assuming users already exist with activity data!');
    }).then(function(users) {
        //console.log('before seedNonProfit');
        return seedNonProfit(users).then(function(nonprofits) {
          //console.log('before seedAPI');
                return seedEvents(nonprofits).then(function () {
                  console.log(chalk.green('Seed successful!'));
                  process.kill(0);
                });
          })
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});