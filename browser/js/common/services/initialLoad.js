app.service('InitialLoadService', function($rootScope, $q, $timeout, AuthService, UserFactory) {
    var service = this;

    service.loadList = [];
    service.serviceUpdater = null;
    service.callback = null;

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

        // Step 1: check user is logged in
        service.registerLoadSteps(function() {
            return AuthService.getLoggedInUser().then(function(user) {
                var status = "Checking to Sync User...";
                service.serviceUpdater(status);

                return user;

            });
        });

        // Step 2: get/check last Log update & the user's active devices
        // returns true if its time to update
        service.registerLoadSteps(function(user) {
            var lastUpdateTime = Math.round((new Date(user.lastLogUpdate)).getTime()/1000);
            var currentTime = Math.round((new Date()).getTime()/1000);
            var timeGapLimit = 0; // might want to increase after debug;

            return user.active.length > 0 && currentTime - lastUpdateTime > timeGapLimit;
        });

        // Step 3: if it's time to update, refresh token first
        // TODO: Backend to monitor when to refresh the token or not
        service.registerLoadSteps(function(timeToUpdate) {
            if (timeToUpdate) {
                return UserFactory.refreshTokens()
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
            $timeout(service.callback, 2000); // debug mimic laggy server
            return response;
        });
    };
});