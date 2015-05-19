app.factory('UserFactory', function($http, $q, $auth) {
    var currentUserLogs = {
        distance: 0,
        calories: 0,
        steps: 0,
        startDate: null,
        endDate: null
    };
    var createNewUser = function(newUser) {
        return $http.post('/api/user/signup', newUser)
            .then(function(response) {
                return response.body;
            })
            .catch(function(response) {
                console.log(response);
                return $q.reject({message : 'Unable to Sign Up'});
            });
    };

    var linkDevice = function(provider, user) {
        return $auth.authenticate(provider, {
            user : user,
            provider : provider
        })
        .then(function(response) {
            return response.data.user;
        })
        .catch(function(err) {
            console.log(err);
        });
    };

    var disconnectDevice = function(provider) {
        return $http.delete('/api/user/device/' + provider).then(function(response) {
            return response.data;
        });
    };

    var updateLogs = function() {
        return $http.put('/api/user/logs/').then(function(response) {
            return response.data;
        });
    };

    var refreshTokens = function() {
        return $http.put('/api/user/tokens/').then(function(response) {
            return response.data;
        });
    };

    var getUserLogs = function() {
        return $http.get('/api/user/logs/').then(function(response) {
            return response.data;
        });
    };
    // available api to link
    var availableDevices = ['jawbone', 'fitbit'];

    return {
        currentUserLogs: currentUserLogs,
        createNewUser : createNewUser,
        availableDevices : availableDevices,
        linkDevice : linkDevice,
        disconnectDevice: disconnectDevice,
        refreshTokens : refreshTokens,
        updateLogs : updateLogs,
        getUserLogs : getUserLogs
    };
});