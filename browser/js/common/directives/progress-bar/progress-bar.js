'use strict';
app.directive('progressBar', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            goals: '='
        },
        templateUrl: 'js/common/directives/progress-bar/progress-bar.html',
        link: function(scope, element, attr) {
            scope.$watch('goals', function() {
                _.forEach(scope.goals, function(goal) {
                    $timeout(function() {
                        if (goal.metrics.progress) {
                            var percentage = goal.metrics.progress * 100;
                            percentage = percentage > 100 ? 100 : percentage;
                            goal.style = { width : (percentage / scope.goals.length ).toFixed(2) + "%"};
                        } else {
                            goal.style = { width : "0%"};
                        }
                    }, 500);
                });
            });
        }
    };
});