app.directive('initialLoad', function($rootScope, InitialLoadService, $timeout, AuthService) {
    return {
        restrict : 'E',
        scope    : {},
        templateUrl: 'js/common/directives/initial-load/initial-load.html',
        link: function(scope, element, attrs) {
            scope.loaded = false;
            var updateLoadStatus = function(err, res) {
                if (err) throw err;
                $timeout(function() {
                    scope.loaded = true;
                }, 1000);
            };

            var displayStatus = function(status) {
                scope.status = status;
            };

            scope.loadPermitted = false;
            InitialLoadService.onBeforeRequestSync(function() {
                AuthService.getLoggedInUser().then(function(user) {
                    if (user) {
                        scope.loadPermitted = true;
                        scope.loaded = false;
                    }
                });
            });

            InitialLoadService.registerLoadCallback(updateLoadStatus);
            InitialLoadService.registerServiceUpdater(displayStatus);

            InitialLoadService.requestSync().then(function(logs) {
                console.log(logs);
            });
        }
    };
});