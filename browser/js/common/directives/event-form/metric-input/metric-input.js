app.directive('metricInput', function() {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : 'js/common/directives/event-form/metric-input/metric-input.html',
        scope    : {
            goal : '='
        },
        link : function(scope) {
            scope.$watch('goal.metrics.target', function(value) {
                scope.goal.metrics.target = parseInt(value);
            });
        }
    };
});

app.directive('numbersOnly', function() {
    return {
        restrict : 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function numberExtract(text) {
                var numInput = text.replace(/[^0-9]/g, '');

                if(numInput !== text) {
                    ngModelCtrl.$setViewValue(numInput);
                    ngModelCtrl.$render();
                }

                return numInput;
            }
            ngModelCtrl.$parsers.push(numberExtract);
        }
    };
});