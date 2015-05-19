app.service("LoadService", function($q, $rootScope, UserFactory) {
    var service = this, promise;

    service.user = null;
    service.events = {
        fetchingData    : 'fetchingData',
        loadingComplete : 'loadingComplete',
        loadingError    : 'loadingError',
        loadInit        : 'loadInit',
        loadPause       : 'loadPause',
        loadResume      : 'loadResume'
    };

    var fetchLogData = function() {
        return $q.when().then(function() {
            $rootScope.$broadcast(service.events.fetchingData);
            return  UserFactory.updateLogs();
        }).then(function(logs) {
            $rootScope.$broadcast(service.events.loadingComplete, logs);
        });
    };

    // Checking for users and the last time they have updated the log
    service.initLoad = function(user) {
        if (user) {
            service.user = user;
            var lastUpdateTime = new Date(user.lastLogUpdate).getTime();
            var currentTime = new Date().getTime();
            var timeGapLimit = 60 * 30 * 1000; // might want to increase after debug;

            if (user.active.length > 0 && currentTime - lastUpdateTime > timeGapLimit) {
                $rootScope.$broadcast(service.events.loadInit);

                promise = $q.when().then(function() {
                    return UserFactory.refreshTokens();
                }).catch(function(err) {
                    $rootScope.$broadcast(service.events.loadPause, err);

                    return false;
                }).then(function(permissionToUpdate) {
                    if (permissionToUpdate) {
                        return fetchLogData();
                    }
                }).catch(function(err) {
                    $rootScope.$broadcast(service.events.loadingError, err);
                });
            }
        }
    };

    // Fitbit tends to fail at refreshing tokens, so create an option to re-link your devices
    service.reLinkDevice = function() {
        if (service.user && service.user.active.length > 0) {
            promise.then(function() {
                $rootScope.$broadcast(service.events.loadResume);

                return _.reduce(service.user.active, function(chain, provider) {
                    return chain.then(function() {
                        return UserFactory.linkDevice(provider, service.user._id);
                    });
                }, $q.when());
            }).then(function(user) {
                service.user = user;
                return  fetchLogData();
            }).catch(function(err) {
                console.log(err);
                $rootScope.$broadcast(service.events.loadingError, err);
            });
        }
    };
});