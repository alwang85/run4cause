'use strict';
var router = require('express').Router();
module.exports = function(app){
    router.use('/tutorial', require('./tutorial'));
    router.use('/members', require('./members'));
    router.use('/jawbone', require('./jawbone')(app));

    // Make sure this is after all of
    // the registered routes!
    router.use(function (req, res) {
        res.status(404).end();
    });
    return router;
};

