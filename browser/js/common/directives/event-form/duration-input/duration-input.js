app.directive('durationInput', function() {
   return {
        restrict : 'E',
        replace  : true,
        scope : {
            eventForm : '=',
            onChange  : '&'
        },
        templateUrl : 'js/common/directives/event-form/duration-input/duration-input.html',
        link : function(scope, element, attr) {
            scope.durationList = [
                {name : 'Days', value : 60 * 60 * 24 * 1000},
                {name : 'Weeks', value : 60 * 60 * 24 * 7 * 1000},
                {name : 'Months', value : 60 * 60 * 24 * 30 * 1000}
            ];

            scope.selectedValue = null;
            scope.durationQty = null;

            scope.updateDuration = function() {
                return {
                    actUpon : function(selectedDuration) {
                        if (scope.durationQty) {
                            //console.log(parseInt(scope.durationQty) * selectedDuration.value)
                            scope.selectedValue = selectedDuration.value;
                            scope.onChange().actUpon(parseInt(scope.durationQty) * selectedDuration.value);
                        }
                    }
                };
            };

            scope.$watch('durationQty', function(value) {
                if (scope.selectedValue) {
                    //console.log(parseInt(value) * scope.selectedValue);
                    scope.onChange().actUpon(parseInt(value) * scope.selectedValue);
                }
            });
        }
   };
});