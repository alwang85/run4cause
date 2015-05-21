'use strict';
app.directive('progressBar', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            goals: '='
        },
        templateUrl: 'js/common/directives/progress-bar/progress-bar.html',
        link: function(scope, element, attr) {
            $timeout(function() {
                _.forEach(scope.goals, function(goal) {
                    goal.style = { width : (goal.metrics.progress * 100).toFixed(2) + "%"};
                });
            }, 500);
        }
    };
});