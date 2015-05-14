'use strict';
var router = require('express').Router();
module.exports = function(app){
    router.use('/user', require('./user')(app));
    router.use('/event', require('./event'));
   router.use('/nonprofit', require('./nonprofit'));
    // Make sure this is after all of
    // the registered routes!
    router.use(function (req, res) {
        res.status(404).end();
    });
    return router;
};

