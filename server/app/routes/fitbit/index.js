'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

router.get('/getUserSteps', function(req,res,next){
    var options = {
        url: 'https://api.fitbit.com/1/user/'+req.user.fitbit.id+'/activities/tracker/steps/date/today/1m.json'
        //headers: {
        //    'User-Agent': 'request'
        //}
    };
    request('https://api.fitbit.com/1/user/39VX8N/activities/tracker/steps/date/today/1m.json')
        .auth(null, null, true, req.user.fitbit.token)
        .then(function(steps){
        console.log(steps);
    })
});

