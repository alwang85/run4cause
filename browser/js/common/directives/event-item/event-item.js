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

            scope.$watch('event.goals', function() {
                _.forEach(scope.event.goals, function(goal) {
                    goal.metrics.unit = unit[goal.metrics.measurement];
                });
            });

            scope.totalRaised = _.reduce(scope.event.sponsors, function(totalRaised, sponsor) {
                var progress = scope.event.progress > 1 ? 1 : scope.event.progress;
                return totalRaised + sponsor.details['100'] * progress;
            }, 0.0);

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

app.filter('targetformat', function () {
    return function (target) {
        if (target >= 10000) {
            target = (target/1000).toFixed(1) + 'K';
        }
        return target;
    };
});