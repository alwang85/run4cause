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
var Strategy = mongoose.model('Strategy');
var API = mongoose.model('API');
var Challenge = mongoose.model('Challenge');
var Metric = mongoose.model('Metric');
var newEvent = mongoose.model('newEvent');




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

var seedAPI = function(){
    var api = [{
        source     : 'fitbit',
        metrics: [{
            //name: "distance",
            //route: "/api/fitbit/distance",
            apiRoute: 'https://api.fitbit.com/1/user/-/activities/tracker/distance/date'
        },{
            //name: "steps",
            //route: "/api/fitbit/steps",
            apiRoute: 'https://api.fitbit.com/1/user/-/activities/tracker/steps/date'
        },{
            //name: "sleep",
            //route: "/api/fitbit/sleep",
            apiRoute: 'https://api.fitbit.com/1/user/-/sleep/minutesAsleep/date'

        },{
            name: "calories",
            route: "/api/fitbit/sleep",
            apiRoute: 'https://api.fitbit.com/1/user/-/activities/tracker/calories/date'

        }]
    },{
        source     : 'jawbone',
        metrics: [
            {
                apiRoute: "https://jawbone.com/nudge/api/v.1.1/users/@me/moves"
            },
            {
                apiRoute: "https://jawbone.com/nudge/api/v.1.1/users/@me/sleeps"
            }
        ]
    }];

    return q.invoke(API, 'create', api);

};


var seedMetrics = function(api){
    return API.find({}).exec().then(function(api){
      var metrics = [{
        category: 'health',
        name: 'distance',
        sources: [{
          name: 'fitbit',
          apiRef: api[0]._id
        },{
          name: 'jawbone',
          apiRef: api[1]._id
        }]
      },{
        category: 'health',
        name: 'sleep',
        sources: [{
          name: 'fitbit',
          apiRef: api[0]._id
        },{
          name: 'jawbone',
          apiRef: api[1]._id
        }]
      },{
        category: 'health',
        name: 'steps',
        sources: [{
          name: 'fitbit',
          apiRef: api[0]._id
        },{
          name: 'jawbone',
          apiRef: api[1]._id
        }]
      }];
      return q.invoke(Metric, 'create', metrics);
    });
};


var seedNewEvents = function(nonprofits){
  return User.find({}).exec()
    .then(function(users) {
      //console.log('users inside new seed events', users);
      var newEvents = [{
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
      return q.invoke(newEvent, 'create', newEvents);
    });
};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
      console.log('assuming users already exist with activity data!');
    }).then(function(users) {
        //console.log('before seedNonProfit');
        return seedNonProfit(users).then(function(nonprofits) {
          //console.log('before seedAPI');
          return seedAPI(nonprofits).then(function(api) {
            //console.log('before seedMetrics');
            return seedMetrics(api).then(function(metrics) {
                return seedNewEvents(nonprofits).then(function () {
                  console.log(chalk.green('Seed successful!'));
                  process.kill(0);
                });
              });
            });
          })
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});