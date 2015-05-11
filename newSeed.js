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
var Events = mongoose.model('Event');
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
            log: [
                {
                    date: new Date('2015-05-04'),
                    metrics: [{
                        measurement: "calories",
                        qty: 800
                    },{
                        measurement: "distance",
                        qty: 2
                    },{
                        measurement: "sleep",
                        qty: 8
                    }
                    ]
                },{
                    date: new Date('2015-05-05') ,
                    metrics: [{
                        measurement: "calories",
                        qty: 1200
                    },{
                        measurement: "distance",
                        qty: 2
                    },{
                        measurement: "sleep",
                        qty: 8
                    }
                    ]
                },{
                    date: new Date('2015-05-03'),
                    metrics: [{
                        measurement: "calories",
                        qty: 1100
                    },{
                        measurement: "distance",
                        qty: 2
                    },{
                        measurement: "sleep",
                        qty: 7
                    }
                    ]
                },{
                    date: new Date('2015-05-02') ,
                    metrics: [{
                        measurement: "calories",
                        qty: 1000
                    },{
                        measurement: "distance",
                        qty: 3
                    },{
                        measurement: "sleep",
                        qty: 6
                    }
                    ]
                },{
                    date: new Date('2015-05-01'),
                    metrics: [{
                        measurement: "calories",
                        qty: 900
                    },{
                        measurement: "distance",
                        qty: 4
                    },{
                        measurement: "sleep",
                        qty: 5
                    }
                    ]
                },{
                    date: new Date('2015-04-30') ,
                    metrics: [{
                        measurement: "calories",
                        qty: 1100
                    },{
                        measurement: "distance",
                        qty: 2
                    },{
                        measurement: "sleep",
                        qty: 5
                    }
                    ]
                },{
                    date: new Date('2015-04-29'),
                    metrics: [{
                        measurement: "calories",
                        qty: 1300
                    },{
                        measurement: "distance",
                        qty: 4
                    },{
                        measurement: "sleep",
                        qty: 6
                    }
                    ]
                },{
                    date: new Date('2015-04-28') ,
                    metrics: [{
                        measurement: "calories",
                        qty: 1100
                    },{
                        measurement: "distance",
                        qty: 3
                    },{
                        measurement: "sleep",
                        qty: 6
                    }
                    ]
                }
            ]
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',log: [
            {
                date: new Date('2015-05-04'),
                metrics: [{
                    measurement: "calories",
                    qty: 800
                },{
                    measurement: "distance",
                    qty: 3
                },{
                    measurement: "sleep",
                    qty: 6
                }
                ]
            },{
                date: new Date('2015-05-05') ,
                metrics: [{
                    measurement: "calories",
                    qty: 1200
                },{
                    measurement: "distance",
                    qty: 5
                },{
                    measurement: "sleep",
                    qty: 7
                }
                ]
            },{
                date: new Date('2015-05-03'),
                metrics: [{
                    measurement: "calories",
                    qty: 1300
                },{
                    measurement: "distance",
                    qty: 3
                },{
                    measurement: "sleep",
                    qty: 7
                }
                ]
            },{
                date: new Date('2015-05-02') ,
                metrics: [{
                    measurement: "calories",
                    qty: 900
                },{
                    measurement: "distance",
                    qty: 4
                },{
                    measurement: "sleep",
                    qty: 6
                }
                ]
            },{
                date: new Date('2015-05-01'),
                metrics: [{
                    measurement: "calories",
                    qty: 1300
                },{
                    measurement: "distance",
                    qty: 4
                },{
                    measurement: "sleep",
                    qty: 6
                }
                ]
            },{
                date: new Date('2015-04-30') ,
                metrics: [{
                    measurement: "calories",
                    qty: 1100
                },{
                    measurement: "distance",
                    qty: 4
                },{
                    measurement: "sleep",
                    qty: 7
                }
                ]
            },{
                date: new Date('2015-04-29'),
                metrics: [{
                    measurement: "calories",
                    qty: 1200
                },{
                    measurement: "distance",
                    qty: 5
                },{
                    measurement: "sleep",
                    qty: 6
                }
                ]
            },{
                date: new Date('2015-04-28') ,
                metrics: [{
                    measurement: "calories",
                    qty: 1100
                },{
                    measurement: "distance",
                    qty: 5
                },{
                    measurement: "sleep",
                    qty: 7
                }
                ]
            }
        ]
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
            apiRoute: 'https://api.fitbit.com/1/user/-/activities/tracker/distance/date/today/1d.json'
        },{
            //name: "steps",
            //route: "/api/fitbit/steps",
            apiRoute: 'https://api.fitbit.com/1/user/-/activities/tracker/steps/date/today/1d.json'
        },{
            //name: "sleep",
            //route: "/api/fitbit/sleep",
            apiRoute: 'https://api.fitbit.com/1/user/-/sleep/minutesAsleep/date/today/1d.json'

        },{
            name: "calories",
            route: "/api/fitbit/sleep",
            apiRoute: 'https://api.fitbit.com/1/user/-/activities/tracker/calories/date/today/1d.json'

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
    var metrics = [{
        category: 'health',
        name: 'distance',
        sources: [{
            name: 'fitbit',
            apiRef: api[0]
        },{
            name: 'jawbone',
            apiRef: api[1]
        }]
    },{
        category: 'health',
        name: 'sleep',
        sources: [{
            name: 'fitbit',
            apiRef: api[0]
        },{
            name: 'jawbone',
            apiRef: api[1]
        }]
    },{
        category: 'health',
        name: 'steps',
        sources: [{
            name: 'fitbit',
            apiRef: api[0]
        },{
            name: 'jawbone',
            apiRef: api[1]
        }]
    }];
    return q.invoke(Metric, 'create', metrics);
};

var seedChallenges = function(metrics){
    var challenges = [{
        startDate: new Date,
        endDate: new Date('2015-05-14'),
        metric: metrics[0],
        category: 'total',
        goal: 100,
        description: 'Walk 100 miles',
        name: 'Walk 100 miles'
    },
    {
        startDate: new Date,
        endDate: new Date('2015-05-14'),
        metric: metrics[0],
        category: 'total',
        goal: 90000,
        description: 'Sleep alot',
        name: 'Sleep alot'
    },{
        startDate: new Date,
        endDate: new Date('2015-05-14'),
        metric: metrics[0],
        category: 'total',
        goal: 10000,
        description: 'Walk 10000 steps',
        name: 'Walk 10000 steps'
    }];
    //TODO: Add frequency and average challenges later

    return q.invoke(Challenge, 'create', challenges);
};

var seedNewEvents = function(challenges, nonprofits){
  return User.find({}).exec()
    .then(function(users) {
      //console.log('users inside new seed events', users);
      var newEvents = [{
        category: 1,
        group: false,
        contest: false,
        progess: 0,
        goal: 100,
        challenges: [challenges[0]],
        creator: users[0],
        challengers: [{
          user: users[0],
          join: new Date('2015-05-01')
        }],
        startDate: new Date('2015-05-11'),
        endDate: new Date('2015-05-18'),
        nonProfit: nonprofits[0],
        description: "Lets walk lots of miles.",
        name: "Walk."
      },
        {
          category: 1,
          group: true,
          contest: true,
          progess: 0,
          goal: 100,
          challenges: [challenges[0]],
          creator: users[0],
          challengers: [{
            user: users[0],
            join: new Date('2015-05-01')
          },
            {
              user: users[0],
              join: new Date('2015-05-01')
            }],
          startDate: new Date('2015-05-11'),
          endDate: new Date('2015-05-18'),
          nonProfit: nonprofits[1],
          description: "Lets sleep",
          name: "Sleep."
        }];
      return q.invoke(newEvent, 'create', newEvents);
    });
};

//var seedEvents = function() {
//    var foundUsers;
//    var foundStrategies;
//    var nonProfits;
//    return User.find({}).exec()
//        .then(function(users) {
//            foundUsers = users;
//        })
//        .then(function(){
//            return Strategy.find({}).exec()
//        })
//        .then(function(strategies){
//            foundStrategies = strategies;
//        })
//        .then(function(){
//            return Nonprofit.find({}).exec()
//        })
//        .then(function(foundNonprofits){
//            var events = [{
//                type: 'goal',
//                creator: foundUsers[0]._id,
//                strategy: foundStrategies[0]._id,
//                challengers: [{
//                    user: foundUsers[0],
//                    join: new Date('2015-05-01')
//                },
//                    {
//                        user: foundUsers[1],
//                        join: new Date('2015-05-02')
//                    }],
//                startDate: new Date('2015-05-01'),
//                endDate: new Date('2015-05-03'),
//                nonProfit: foundNonprofits[0]._id
//            },
//                {
//                    type: 'lifeStyle',
//                    creator: foundUsers[0]._id,
//                    strategy: foundStrategies[1]._id,
//                    challengers: [{
//                        user: foundUsers[0],
//                        join: new Date('2015-05-02')
//                    },
//                        {
//                            user: foundUsers[1],
//                            join: new Date('2015-05-02')
//                        }],
//                    startDate: new Date('2015-05-02'),
//                    endDate: new Date('2015-05-02'),
//                    nonProfit: foundNonprofits[1]._id
//                },
//                {
//                    type: 'lifeStyle',
//                    creator: foundUsers[0]._id,
//                    strategy: foundStrategies[1]._id,
//                    challengers: [{
//                        user: foundUsers[0],
//                        join: new Date('2015-05-02')
//                    },
//                        {
//                            user: foundUsers[1],
//                            join: new Date('2015-05-02')
//                        }],
//                    startDate: new Date('2015-05-02'),
//                    endDate: new Date('2015-05-02'),
//                    nonProfit: foundNonprofits[1]._id
//                },
//                {
//                    type: 'lifeStyle',
//                    creator: foundUsers[0]._id,
//                    strategy: foundStrategies[1]._id,
//                    challengers: [{
//                        user: foundUsers[0],
//                        join: new Date('2015-05-02')
//                    },
//                        {
//                            user: foundUsers[1],
//                            join: new Date('2015-05-02')
//                        }],
//                    startDate: new Date('2015-05-02'),
//                    endDate: new Date('2015-05-02'),
//                    nonProfit: foundNonprofits[1]._id
//                },
//                {
//                    type: 'lifeStyle',
//                    creator: foundUsers[1]._id,
//                    strategy: foundStrategies[1]._id,
//                    challengers: [{
//                        user: foundUsers[0],
//                        join: new Date('2015-05-02')
//                    },
//                        {
//                            user: foundUsers[1],
//                            join: new Date('2015-05-02')
//                        }],
//                    startDate: new Date('2015-05-02'),
//                    endDate: new Date('2015-05-02'),
//                    nonProfit: foundNonprofits[1]._id
//                }
//            ];
//
//            return q.invoke(Events, 'create', events)
//                .then(function(event){
//                    foundNonprofits[0].events.push(event);
//                    foundNonprofits[0].save();
//                });
//        });
//};

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
              //console.log('before seedChallenges');
              return seedChallenges(metrics).then(function(challenges) {
                //console.log('before seedNewEvents');
                return seedNewEvents(challenges, nonprofits).then(function () {
                  console.log(chalk.green('Seed successful!'));
                  process.kill(0);
                });
              });
            });
          })
        });
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});