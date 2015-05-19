app.directive('initialLoad', function($window, $rootScope, $q, AuthService, UserFactory) {
    return {
        restrict : 'E',
        scope    : {},
        templateUrl: 'js/common/directives/initial-load/initial-load.html',
        link: function(scope, element, attrs) {
            scope.loadingTime = false;
            scope.loaded = false;
            scope.linkDeviceRequired = false;
            scope.loadPause = false;
            scope.user = null;
            scope.status = "Initializing...";

            var promise;

            var fetchLogData = function() {
                return $q.when().then(function() {
                    scope.status = "Fetching Device Data...";
                    return  UserFactory.updateLogs();
                }).then(function(logs) {
                    scope.status = "Done!";
                    scope.loaded = true;
                });
            };

            AuthService.getLoggedInUser().then(function (user) {
                if (user) {
                    scope.user = user;
                    var lastUpdateTime = new Date(user.lastLogUpdate).getTime();
                    var currentTime = new Date().getTime();
                    var timeGapLimit = 60 * 30 * 1000; // might want to increase after debug;

                    if (user.active.length > 0 && currentTime - lastUpdateTime > timeGapLimit) {
                        scope.loadingTime = true;

                        promise = $q.when().then(function() {
                            return UserFactory.refreshTokens();
                        }).catch(function(err) {
                            scope.linkDeviceRequired = true;
                            scope.loadPause = true;
                            return false;
                        }).then(function(permissionToUpdate) {
                            if (permissionToUpdate) {
                                return fetchLogData();
                            }
                        }).catch(function(err) {
                            console.log(err);
                            scope.loaded = true;
                        });
                    }
                }
            });

            scope.reLinkDevice = function() {
                if (scope.user && scope.user.active.length > 0) {
                    promise.then(function() {
                        scope.loadPause = false;
                        scope.linkDeviceRequired = false;

                        return _.reduce(scope.user.active, function(chain, provider) {
                             return chain.then(function() {
                                 return UserFactory.linkDevice(provider, scope.user._id);
                             });
                        }, $q.when());
                    }).then(function(user) {
                        scope.user = user;
                        return  fetchLogData();
                    }).catch(function(err) {
                        console.log(err);
                        scope.loaded = true;
                    });
                }
            };
        }
    };
});