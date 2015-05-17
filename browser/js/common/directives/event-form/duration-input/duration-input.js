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
                {name : 'Days', value : 60 * 60 * 24 * 1000, limit : 7},
                {name : 'Weeks', value : 60 * 60 * 24 * 7 * 1000, limit : 4},
                {name : 'Months', value : 60 * 60 * 24 * 30 * 1000, limit : 12}
            ];

            var timeDiff,finder;
            if (scope.eventForm.endDate) {
                timeDiff = scope.eventForm.endDate.getTime() - scope.eventForm.startDate.getTime();

                finder = _.find(scope.durationList, function(listItem) {
                    var numberOf = Math.round(timeDiff / listItem.value);

                    return numberOf <= listItem.limit;
                });
            }

            scope.selectedValue = finder ? finder.value : null;
            scope.durationQty = finder && timeDiff ? Math.round(timeDiff / finder.value) : null;

            scope.selectDuration = function() {
                return {
                    actUpon : function(selectedDuration) {
                        //console.log(selectedDuration);
                        if (scope.durationQty) {
                            //console.log(parseInt(scope.durationQty) * selectedDuration.value)
                            scope.selectedValue = selectedDuration.value;
                            scope.onChange().actUpon(parseInt(scope.durationQty) * selectedDuration.value);
                        }
                    }
                };
            };

            scope.selectedDuration = function() {
                return {
                    actUpon : function(listItem) {
                        //console.log(selectedDuration);
                        if (finder) {
                            return listItem.value === finder.value;
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