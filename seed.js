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
                  measurement: "distance",
                  qty: 1660
                },{
                  measurement: "sleep",
                  qty: 16000
                }
                ]
              },{
                date: new Date('2015-05-05') ,
                metrics: [{
                  measurement: "distance",
                  qty: 2600
                },{
                  measurement: "sleep",
                  qty: 18000
                }
                ]
              },{
                date: new Date('2015-05-03'),
                metrics: [{
                  measurement: "distance",
                  qty: 1660
                },{
                  measurement: "sleep",
                  qty: 15000
                }
                ]
              },{
                date: new Date('2015-05-02') ,
                metrics: [{
                  measurement: "distance",
                  qty: 2600
                },{
                  measurement: "sleep",
                  qty: 14000
                }
                ]
              },{
                date: new Date('2015-05-01'),
                metrics: [{
                  measurement: "distance",
                  qty: 1660
                },{
                  measurement: "sleep",
                  qty: 13000
                }
                ]
              },{
                date: new Date('2015-04-30') ,
                metrics: [{
                  measurement: "distance",
                  qty: 2600
                },{
                  measurement: "sleep",
                  qty: 18000
                }
                ]
              },{
                date: new Date('2015-04-29'),
                metrics: [{
                  measurement: "distance",
                  qty: 2560
                },{
                  measurement: "sleep",
                  qty: 17000
                }
                ]
              },{
                date: new Date('2015-04-28') ,
                metrics: [{
                  measurement: "distance",
                  qty: 1600
                },{
                  measurement: "sleep",
                  qty: 11000
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
              measurement: "distance",
              qty: 1660
            },{
              measurement: "sleep",
              qty: 16000
            }
            ]
          },{
            date: new Date('2015-05-05') ,
            metrics: [{
              measurement: "distance",
              qty: 2600
            },{
              measurement: "sleep",
              qty: 18000
            }
            ]
          },{
            date: new Date('2015-05-03'),
            metrics: [{
              measurement: "distance",
              qty: 1660
            },{
              measurement: "sleep",
              qty: 15000
            }
            ]
          },{
            date: new Date('2015-05-02') ,
            metrics: [{
              measurement: "distance",
              qty: 2600
            },{
              measurement: "sleep",
              qty: 14000
            }
            ]
          },{
            date: new Date('2015-05-01'),
            metrics: [{
              measurement: "distance",
              qty: 1660
            },{
              measurement: "sleep",
              qty: 13000
            }
            ]
          },{
            date: new Date('2015-04-30') ,
            metrics: [{
              measurement: "distance",
              qty: 2600
            },{
              measurement: "sleep",
              qty: 18000
            }
            ]
          },{
            date: new Date('2015-04-29'),
            metrics: [{
              measurement: "distance",
              qty: 2560
            },{
              measurement: "sleep",
              qty: 17000
            }
            ]
          },{
            date: new Date('2015-04-28') ,
            metrics: [{
              measurement: "distance",
              qty: 1600
            },{
              measurement: "sleep",
              qty: 11000
            }
            ]
          }
        ]
        }
    ];

    return q.invoke(User, 'create', users);

};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});