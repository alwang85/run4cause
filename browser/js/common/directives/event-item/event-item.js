'use strict';
app.directive('eventItem', function () {
    return {
        restrict: 'E',
        replace : true,
        scope: {
            event: '=',
            currentUser: '='
        },
        templateUrl: 'js/common/directives/event-item/event-item.html',
        link: function(scope, element, attr) {
            scope.modalToggle = false;
            scope.modalList = false;

            var unit = {
                'distance' : 'miles',
                'calories' : 'cals',
                'steps'    : 'steps'
            };

            _.forEach(scope.event.goals, function(goal) {
                goal.metrics.unit = unit[goal.metrics.measurement];
            });

            scope.displayInnerModal = function(list) {
                scope.modalToggle = scope.modalToggle ? false : true;
                scope.modalList = list;
            };

            scope.hideModal = function() {
                scope.modalToggle = false;
            };
        }
    };
});