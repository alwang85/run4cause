app.directive('eventDropdown', function() {
    return {
        restrict : 'E',
        scope    : {
            droplist : '=',
            placeholder : '@',
            onChange : '&'
        },
        templateUrl : 'js/common/directives/event-form/event-dropdown/event-dropdown.html',
        link : function(scope, element, attr) {
            scope.itemSelected = false;
            scope.selectItem = function() {

            };
        }
    };
});