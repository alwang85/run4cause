app.directive('initialLoad', function($rootScope, AuthService, AUTH_EVENTS, LoadService) {
    return {
        restrict : 'E',
        scope    : {},
        templateUrl: 'js/common/directives/initial-load/initial-load.html',
        link: function(scope, element, attrs) {
            scope.loadingTime = false;
            scope.loaded = false;
            scope.linkDeviceRequired = false;
            scope.loadPause = false;
            scope.status = "Initializing";

            $rootScope.$on(LoadService.events.loadInit, function(event) {
                scope.loadingTime = true;
            });

            $rootScope.$on(LoadService.events.fetchingData, function(event) {
                scope.status = "Fetching Device Data";
            });

            $rootScope.$on(LoadService.events.loadingComplete, function(event, logs) {
                console.log(logs);
                scope.status = "Done!";
                scope.loaded = true;
            });

            $rootScope.$on(LoadService.events.loadingError, function(event, error) {
                console.log(error);
                scope.loaded = true;
            });

            $rootScope.$on(LoadService.events.loadPause, function(event, error) {
                console.log(error);
                scope.status = "Device Link Error";
                scope.linkDeviceRequired = true;
                scope.loadPause = true;
            });

            $rootScope.$on(LoadService.events.loadResume, function(event) {
                scope.loadPause = false;
                scope.linkDeviceRequired = false;
            });

            scope.reLinkDevice = function() {
                LoadService.reLinkDevice();
            };

            AuthService.getLoggedInUser().then(function (user) {
                LoadService.initLoad(user);
            });

            $rootScope.$on(AUTH_EVENTS.loginPostSuccess, function(event, user) {
                console.log(user);
                LoadService.initLoad(user);
            });
        }
    };
});