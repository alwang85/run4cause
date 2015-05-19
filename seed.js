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
      username: 'admin',
      email: 'admin@impactmission.io',
      password: 'password',
      lastLogUpdate: new Date((new Date()).getTime() - 15*24*60*60*1000),
      profile: 'https://media.licdn.com/media/p/4/005/026/095/0654ff7.png'
    },{
      username: 'Alex',
      email: 'alex@fsa.com',
      password: 'fullstack',
      lastLogUpdate: new Date((new Date()).getTime() - 15*24*60*60*1000),
      profile: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAJEAAAAJDY4MDAzMWVlLTFmNmUtNDU3My04Mzc2LTFhYTQ3OTFhOTc1MQ.jpg'
    },
    {
      username: 'Sam',
      email: 'sam@fsa.com',
      password: 'fullstack',
      lastLogUpdate: new Date((new Date()).getTime() - 15*24*60*60*1000),
      profile: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/8/005/07c/34b/0a3f4f0.jpg'
    },{
      username: 'Christian',
      email: 'christian@fsa.com',
      password: 'fullstack',
      lastLogUpdate: new Date((new Date()).getTime() - 15*24*60*60*1000),
      profile: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAOPAAAAJDlmZjk3YWQ1LWQxNjgtNGQ0Ny04OWE1LTQyMThhZmQ0MGVjOA.jpg'
    },
    {
      username: 'Steve',
      email: 'steve@fsa.com',
      password: 'fullstack',
      lastLogUpdate: new Date((new Date()).getTime() - 15*24*60*60*1000),
      profile: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/2/005/0a6/3aa/3967988.jpg'
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