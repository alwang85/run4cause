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

            scope.displayInnerModal = function(list) {
                console.log("here");
                scope.modalToggle = scope.modalToggle ? false : true;
                scope.modalList = list;
            };

            scope.hideModal = function() {
                scope.modalToggle = false;
            };
        }
    };
});