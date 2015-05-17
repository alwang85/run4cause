app.directive('initialLoad', function($rootScope, InitialLoadService, $timeout, AuthService, AUTH_EVENTS) {
    return {
        restrict : 'E',
        scope    : {},
        templateUrl: 'js/common/directives/initial-load/initial-load.html',
        link: function(scope, element, attrs) {
            scope.loaded = false;
            var updateLoadStatus = function(err, res) {
                if (err) throw err;
                scope.loaded = true;
            };

            var displayStatus = function(status) {
                scope.status = status;
            };

            scope.loadPermitted = false;
            InitialLoadService.onBeforeRequestSync(function() {
                if (AuthService.isAuthenticated()) {
                    scope.loadPermitted = true;
                    scope.loaded = false;
                }
            });

            InitialLoadService.registerLoadCallback(updateLoadStatus);
            InitialLoadService.registerServiceUpdater(displayStatus);

            $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
                AuthService.getLoggedInUser().then(function (user) {
                    if (user) {
                        InitialLoadService.requestSync(user);
                    }
                });
            });
        }
    };
});