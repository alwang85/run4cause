'use strict';
var router = require('express').Router();
module.exports = function(app){
    router.use('/jawbone', require('./jawbone')(app));
    router.use('/fitbit', require('./fitbit')(app));
    router.use('/event', require('./event'));
    router.use('/user', require('./user')(app));
    // Make sure this is after all of
    // the registered routes!
    router.use(function (req, res) {
        res.status(404).end();
    });
    return router;
};

