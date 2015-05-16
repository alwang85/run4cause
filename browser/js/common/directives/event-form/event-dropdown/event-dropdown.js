app.directive('eventDropdown', function() {
    return {
        restrict : 'E',
        scope    : {
            droplist : '=',
            placeholder : '@',
            onChange : '&'
        },
        replace : true,
        templateUrl : 'js/common/directives/event-form/event-dropdown/event-dropdown.html',
        link : function(scope, element, attr) {
            scope.itemSelected = false;
            scope.selectedName = scope.placeholder.toUpperCase();

            scope.selectItem = function(index) {
                scope.itemSelected = scope.selectedName = scope.droplist[index].name.toUpperCase();
                scope.onChange().actUpon(scope.droplist[index]);
            };
        }
    };
});