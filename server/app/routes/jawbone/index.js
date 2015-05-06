'use strict';
var router = require('express').Router();
module.exports = function(app){
    var jawboneConfig = app.getValue('env').JAWBONE;

    var jawboneOptions = function(req, res, next){
        req.up = require('jawbone-up')({
            access_token: req.user.jawbone.token,
            client_id: jawboneConfig.clientID,
            client_secret: jawboneConfig.clientSecret
        });
        next();
    };

    router.use(jawboneOptions);

    router.get("/moves", function(req, res, next){
        console.log(req.up);
        req.up.moves.get(req.query, function(err, data){
            if(err) return next(err);
            res.json(JSON.parse(data)).status(200);
        });
    });

    return router;

};
