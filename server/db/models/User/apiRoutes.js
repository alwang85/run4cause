var _ = require('lodash');
var apiRoutes = [
    {
        source : 'fitbit',
        metrics : [
            { apiRoute : 'https://api.fitbit.com/1/user/-/activities/tracker/distance/date' },
            { apiRoute : 'https://api.fitbit.com/1/user/-/activities/tracker/steps/date' },
            { apiRoute : 'https://api.fitbit.com/1/user/-/sleep/minutesAsleep/date' },
            { apiRoute : 'https://api.fitbit.com/1/user/-/activities/tracker/calories/date' }
        ]
    },
    {
        source : 'jawbone',
        metrics : [
            { apiRoute : 'https://jawbone.com/nudge/api/v.1.1/users/@me/moves' },
            { apiRoute : 'https://jawbone.com/nudge/api/v.1.1/users/@me/sleeps' }
        ]
    }
];

module.exports = function(activeDevices) {
    return _.map(activeDevices, function(provider) {
        var index = _.findIndex(apiRoutes, function(route) {
            return route.source === provider;
        });

        if (index !== -1) {
            return _.clone(apiRoutes[index], true);
        }
    });
};

