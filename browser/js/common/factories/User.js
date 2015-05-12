app.factory('UserFactory', function($http, $q, $auth) {
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

    var updateLogs = function() {
        return $http.put('/api/user/logs/').then(function(response) {
            return response.data;
        });
    };

    var refreshTokens = function(user) {
        return $http.pu('/api/user/tokens/'+user).then(function(response) {
            return response.data;
        });
    };
    // available api to link
    var availableDevices = ['jawbone', 'fitbit'];

    return {
        createNewUser : createNewUser,
        availableDevices : availableDevices,
        linkDevice : linkDevice,
        updateLogs : updateLogs
    };
});