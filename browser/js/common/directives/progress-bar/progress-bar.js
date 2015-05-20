'use strict';
app.directive('progressBar', function () {
    return {
        restrict: 'E',
        progress: {
            progress: '='
        },
        templateUrl: 'js/common/directives/progress-bar/progress-bar.html'
    };
});