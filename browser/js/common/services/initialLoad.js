app.service('InitialLoadService', function($rootScope, $q, $timeout, AuthService, UserFactory) {
    var service = this;

    service.loadList = [];
    service.serviceUpdater = null;
    service.callback = null;
    service.user = null;
    service.beforeAsyncCallbacks = [];

    service.registerLoadCallback = function(cb) {
        service.callback = cb;
    };

    service.registerLoadSteps = function(func) {
        service.loadList.push(func);
    };

    service.registerServiceUpdater = function(fn) {
        service.serviceUpdater = fn;
    };

    service.loadInit = function() {
        // Step 1: get/check last Log update & the user's active devices
        // returns true if its time to update
        service.registerLoadSteps(function() {
            var user = service.user;
            var status = "Checking User Devices...";
            service.serviceUpdater(status);
            if (user) {
                var lastUpdateTime = Math.round((new Date(user.lastLogUpdate)).getTime()/1000);
                var currentTime = Math.round((new Date()).getTime()/1000);
                var timeGapLimit = 60 * 60; // might want to increase after debug;
                return user.active.length > 0 && currentTime - lastUpdateTime > timeGapLimit;
            } else {
                service.callback(null, null);
            }
        });

        // Step 3: if it's time to update, refresh token first
        // TODO: Backend to monitor when to refresh the token or not
        service.registerLoadSteps(function(timeToUpdate) {
            if (timeToUpdate) {
                return UserFactory.refreshTokens()
            } else { // skip over;
                console.log("not time to update yet");
                service.callback(null, null);
            }
        });

        // Step 4: Once all ready, do the update of api sync to user's logs
        service.registerLoadSteps(function(tokenData) {
            if (tokenData) {
                var status = "Syncing your device data...";
                service.serviceUpdater(status);
                return UserFactory.updateLogs();
            }
        });

        return service;
    };

    service.runLoad = function() {
        return _.reduce(service.loadList, function(chain, loadFunc) {
            return chain.then(loadFunc);
        }, $q.when()).then(function(response) {
            service.callback(null, response);

            return response;
        });
    };

    service.onBeforeRequestSync = function(cb) {
        service.beforeAsyncCallbacks.push(cb);
    };

    service.requestSync = function(user) {
        service.user = user;
        return $q.when().then(function() {
            _.forEach(service.beforeAsyncCallbacks, function(fn) {
                fn();
            });
        }).then(function() {
            if (service.loadList.length > 0) {
                return service.runLoad();
            } else {
                return service.loadInit().runLoad();
            }
        });
    }
});