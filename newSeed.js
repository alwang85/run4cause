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
var Event = mongoose.model('Event');
var Message = mongoose.model('Message');



var q = require('q');
var chalk = require('chalk');

var getCurrentUserData = function () {
    return q.ninvoke(User, 'find', {});
};

var seedEvents = function(){
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
                target: 100,
                progress: 0
            },
            category: 'total'
        }],
        creator: users[2],
        sponsors: [{
          user: users[3],
          details: {
            '0': 10,
            '25': 20,
            '50': 30,
            '75': 40,
            '100': 50
          }
        },{
          user: users[2],
          details: {
            '0': 10,
            '25': 10,
            '50': 10,
            '75': 10,
            '100': 10
          }
        }],
        challengers: [{
          user: users[0],
          individualProgress: 0
        },{
          user: users[1],
          individualProgress: 0
        },{
          user: users[2],
          individualProgress: 0
        },{
          user: users[3],
          individualProgress: 0
        },{
          user: users[4],
          individualProgress: 0
        }],
        startDate: new Date('2015-03-11'),
        endDate: new Date('2015-06-18'),
        description: "Dennis is a student in Kenya. His family struggled to education him so that he could help them in the future, however a past injury prevents Dennis from walking without pain.",
        name: "Walking for Dennis"
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
            target: 300,
            progress: 0
          },
            category: 'total'
          },
            {
              metrics: {
                measurement: 'steps',
                target: 5000,
                progress: 0
              },
              category: 'total'
            }],
          creator: users[3],
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
          },{
            user: users[2],
            individualProgress: 0
          },{
            user: users[3],
            individualProgress: 0
          },{
            user: users[4],
            individualProgress: 0
          }],
          startDate: new Date('2015-03-11'),
          endDate: new Date('2015-06-18'),
          description: "Yoon is a 12 year old girl from Burma, and has lacked in energy and appetite for her entire life due to a damaged heart valve. Her symptoms because so severe that she eventually had to drop out of 4th Grade. We strive to give her better options",
          name: "Walking for Yoon."
        },
        {
          group: true,
          contest: false,
          progress: 0,
          patient: {
            name: "John",
            token: '8948bccfeec2'
          },
          goals:[{  metrics: {
            measurement: 'distance',
            target: 200,
            progress: 0
          },
            category: 'total'
          },
            {
              metrics: {
                measurement: 'steps',
                target: 3500,
                progress: 0
              },
              category: 'total'
            }],
          creator: users[4],
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
          },{
            user: users[2],
            individualProgress: 0
          },{
            user: users[3],
            individualProgress: 0
          },{
            user: users[4],
            individualProgress: 0
          }],
          startDate: new Date('2015-03-11'),
          endDate: new Date('2015-06-18'),
          description: "John is a husband and father living in Kenya. He was ambushed while traveling between work-sites, and has since been unable to work without support and has been in severe pain. Help John to avoid possible severe infection, and get back on his feet to work.",
          name: "Run for John."
        },
        {
          group: true,
          contest: false,
          progress: 0,
          patient: {
            name: "Djeneba",
            token: 'a3e99f5854e1'
          },
          goals:[{  metrics: {
            measurement: 'distance',
            target: 500,
            progress: 0
          },
            category: 'total'
          },
            {
              metrics: {
                measurement: 'steps',
                target: 5000,
                progress: 0
              },
              category: 'total'
            }],
          creator: users[1],
          sponsors: [{
            user: users[4],
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
          },{
            user: users[2],
            individualProgress: 0
          },{
            user: users[3],
            individualProgress: 0
          },{
            user: users[4],
            individualProgress: 0
          }],
          startDate: new Date('2015-03-11'),
          endDate: new Date('2015-06-18'),
          description: "Dejeneba is a mother of three living in Mali. A growing infected ulcer worsened to a severe state with the various mixtures from a traditional healer  failing as a remedy. Help Dejeneba receive lowr extremity ulcer care and allow her to continue with her daily life.",
          name: "Help Dejeneba work again"
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
        sender: users[2],
        recipient: users[1],
        title: "Thanks for helping Dennis!",
        content: "I'd just like to say thank you for joining this event. It is heart breaking to hear how a family struggled to raise one of their children to become educated and their financial hope, and then disabled due to illness. We thank you for joining in physically to accomplish the challenge!"
      },
        {
          timestamp: new Date,
          sender: users[2],
          recipient: users[4],
          title: "Thanks for helping Dennis!",
          content: "I'd just like to say thank you for joining this event. It is heart breaking to hear how a family struggled to raise one of their children to become educated and their financial hope, and then disabled due to illness. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[2],
          recipient: users[3],
          title: "Thanks for helping Dennis!",
          content: "I'd just like to say thank you for sponsoring this event. It is heart breaking to hear how a family struggled to raise one of their children to become educated and their financial hope, and then disabled due to illness. We thank you for sponsoring the other challenges for this event!"
        },{
          timestamp: new Date,
          sender: users[3],
          recipient: users[2],
          title: "Thanks for helping Yoon!",
          content: "I'd just like to say thank you for joining this event. It is heart breaking to hear how a child of just 12 years has dropped from 4th grade due to a heart disease. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[3],
          recipient: users[4],
          title: "Thanks for helping Yoon!",
          content: "I'd just like to say thank you for joining this event. It is heart breaking to hear how a child of just 12 years has dropped from 4th grade due to a heart disease. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[3],
          recipient: users[1],
          title: "Thanks for helping Yoon!",
          content: "I'd just like to say thank you for sponsoring this event. It is heart breaking to hear how a child of just 12 years has dropped from 4th grade due to a heart disease. We thank you for sponsoring the other challenges for this event!"
        },{
          timestamp: new Date,
          sender: users[4],
          recipient: users[2],
          title: "Thanks for helping John!",
          content: "I'd just like to say thank you for joining this event. Your efforts could help John get back on his feet and help prevent potential amputation. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[4],
          recipient: users[3],
          title: "Thanks for helping John!",
          content: "I'd just like to say thank you for joining this event. Your efforts could help John get back on his feet and help prevent potential amputation. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[4],
          recipient: users[1],
          title: "Thanks for helping John!",
          content: "I'd just like to say thank you for joining this event. Your efforts could help John get back on his feet and help prevent potential amputation. We thank you for joining in physically to accomplish the challenge!"
        },{
          timestamp: new Date,
          sender: users[4],
          recipient: users[1],
          title: "Thanks for helping John!!",
          content: "I'd just like to say thank you for sponsoring this event. Your efforts could help John get back on his feet and help prevent potential amputation. We thank you for sponsoring the other challenges for this event!"
        },
        {
          timestamp: new Date,
          sender: users[1],
          recipient: users[2],
          title: "Thanks for helping Dejeneba!",
          content: "I'd just like to say thank you for joining this event. Your efforts could help Dejeneba get back on her feet and help prevent potential amputation. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[1],
          recipient: users[3],
          title: "Thanks for helping Dejeneba!",
          content: "I'd just like to say thank you for joining this event. Your efforts could help Dejeneba get back on her feet and help prevent potential amputation. We thank you for joining in physically to accomplish the challenge!"
        },
        {
          timestamp: new Date,
          sender: users[1],
          recipient: users[4],
          title: "Thanks for helping Dejeneba!",
          content: "I'd just like to say thank you for joining this event. Your efforts could help Dejeneba get back on her feet and help prevent potential amputation. We thank you for joining in physically to accomplish the challenge!"
        },{
          timestamp: new Date,
          sender: users[1],
          recipient: users[4],
          title: "Thanks for helping Dejeneba!!",
          content: "I'd just like to say thank you for sponsoring this event. Your efforts could help Dejeneba get back on her feet and help prevent potential amputation. We thank you for sponsoring the other challenges for this event!"
        }
      ];
      return q.invoke(Message, 'create', Messages);
    });
};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
      console.log('assuming users already exist with activity data!');
    }).then(function() {
          //console.log('before seedAPI');
                return seedEvents().then(function() {
                  //console.log('before seedAPI');
                  return seedMessages().then(function () {
                    console.log(chalk.green('Seed successful!'));
                    process.kill(0);
                  });
          })

    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});