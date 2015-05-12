'use strict';
var router = require('express').Router();
module.exports = function(app){
    router.use('/user', require('./user')(app));
    router.use('/newEvent', require('./newEvent'));
    router.use('/challenge', require('./challenge'));
    router.use('/metric', require('./metric'));
    router.use('/API', require('./API'));
   router.use('/nonprofit', require('./nonprofit'));
    // Make sure this is after all of
    // the registered routes!
    router.use(function (req, res) {
        res.status(404).end();
    });
    return router;
};

