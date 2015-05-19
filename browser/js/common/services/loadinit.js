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
            //scope.status = "Fetching Device Data...";
            $rootScope.$broadcast(service.events.fetchingData);
            return  UserFactory.updateLogs();
        }).then(function(logs) {
            //scope.status = "Done!";
            //scope.loaded = true;
            $rootScope.$broadcast(service.events.loadingComplete, logs);
        });
    };

    service.initLoad = function(user) {
        if (user) {
            service.user = user;
            var lastUpdateTime = new Date(user.lastLogUpdate).getTime();
            var currentTime = new Date().getTime();
            var timeGapLimit = 60 * 30 * 1000; // might want to increase after debug;

            if (user.active.length > 0 && currentTime - lastUpdateTime > timeGapLimit) {
                //scope.loadingTime = true;
                $rootScope.$broadcast(service.events.loadInit);

                promise = $q.when().then(function() {
                    return UserFactory.refreshTokens();
                }).catch(function(err) {
                    //scope.linkDeviceRequired = true;
                    //scope.loadPause = true;
                    $rootScope.$broadcast(service.events.loadPause, err);

                    return false;
                }).then(function(permissionToUpdate) {
                    if (permissionToUpdate) {
                        return fetchLogData();
                    }
                }).catch(function(err) {
                    //scope.loaded = true;
                    $rootScope.$broadcast(service.events.loadingError, err);
                });
            }
        }
    };

    // Fitbit tends to fail at refreshing tokens, so create an option to re-link your devices
    service.reLinkDevice = function() {
        if (service.user && service.user.active.length > 0) {
            promise.then(function() {
                //scope.loadPause = false;
                //scope.linkDeviceRequired = false;
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
                //scope.loaded = true;
                $rootScope.$broadcast(service.events.loadingError, err);
            });
        }
    };
});