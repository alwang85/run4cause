app.directive('initialLoad', function($rootScope, InitialLoadService) {
    return {
        restrict : 'E',
        scope    : {},
        templateUrl: 'js/common/directives/initial-load/initial-load.html',
        link: function(scope, element, attrs) {
            scope.loaded = false;
            var updateLoadStatus = function() {
                scope.loaded = true;
            };

            var displayStatus = function(status) {
                scope.status = status;
            };

            InitialLoadService.registerLoadCallback(updateLoadStatus);
            InitialLoadService.registerServiceUpdater(displayStatus);
        }
    };
});