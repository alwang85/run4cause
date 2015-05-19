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
var Message = mongoose.model('Message');



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

var seedEvents = function(nonprofits){
  return User.find({}).exec()
    .then(function(users) {
      //console.log('users inside new seed events', users);
      var Events = [{
        group: true,
        contest: false,
        progress: 0,
        patient: {
          name: "Dennis",
          token: '624a9a25eef7'
        },
        goals:[{
            metrics: {
                measurement: 'distance',
                target: 100000,
                progress: 0
            },
            category: 'total'
        },{
          metrics: {
            measurement: 'calories',
            target: 200000,
            progress: 0
          },
          category: 'total'
        }],
        creator: users[0],
        sponsors: [{
          user: users[0],
          details: {
            '0': 10,
            '25': 20,
            '50': 30,
            '75': 40,
            '100': 50
          }
        }],
        challengers: [{
            user: users[0],
            individualProgress: 0
        },{
            user: users[1],
            individualProgress: 0
        }],
        startDate: new Date('2015-03-11'),
        endDate: new Date('2015-06-18'),
        nonProfit: nonprofits,
        description: "Lets walk lots of miles.",
        name: "Walk."
      },
      {
          group: true,
          contest: false,
          progress: 0,
          patient: {
            name: "Yoon",
            token: '38453c4bb6a2'
          },
          goals:[{  metrics: {
                  measurement: 'distance',
                  target: 50000,
                  progress: 0
              },
              category: 'total'
          },
          {
              metrics: {
                  measurement: 'steps',
                  target: 50000,
                  progress: 0
              },
              category: 'total'
          }],
          creator: users[0],
          sponsors: [{
            user: users[1],
            details: {
              '0': 50,
              '25': 40,
              '50': 30,
              '75': 20,
              '100': 10
            }
          }],
          challengers: [{
              user: users[0],
              individualProgress: 0
          },{
              user: users[1],
              individualProgress: 0
          }],
          startDate: new Date('2015-03-11'),
          endDate: new Date('2015-06-18'),
          nonProfit: nonprofits,
          description: "many things",
          name: "Walk Sleep."
      }
      ];
      return q.invoke(Event, 'create', Events);
    });
};
var seedMessages = function(){
  return User.find({}).exec()
    .then(function(users) {
      //console.log('users inside new seed events', users);
      var Messages = [{
        timestamp: new Date,
        sender: users[0],
        recipient: users[1],
        title: "welcome",
        content: "this is a test email"
      },
        {
          timestamp: new Date,
          sender: users[1],
          recipient: users[0],
          title: "goodbye",
          content: "this is a test email2"
        }
      ];
      return q.invoke(Message, 'create', Messages);
    });
};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
      console.log('assuming users already exist with activity data!');
    }).then(function(users) {
        //console.log('before seedNonProfit');
        return seedNonProfit(users).then(function(nonprofits) {
          //console.log('before seedAPI');
                return seedEvents(nonprofits).then(function(nonprofits) {
                  //console.log('before seedAPI');
                  return seedMessages().then(function () {
                    console.log(chalk.green('Seed successful!'));
                    process.kill(0);
                  });
                });
          })
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});