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
                    var percentage = goal.metrics.progress / scope.goals.length * 100;
                    percentage = percentage > 100 ? 100 : percentage;
                    goal.style = { width : percentage.toFixed(2) + "%"};
                });
            }, 10);
        }
    };
});