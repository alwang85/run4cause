app.directive('eventDropdown', function() {
    return {
        restrict : 'E',
        scope    : {
            droplist : '=',
            placeholder : '@',
            eventData : '=',
            isSelected : '&',
            onChange : '&'
        },
        replace : true,
        templateUrl : 'js/common/directives/event-form/event-dropdown/event-dropdown.html',
        link : function(scope, element, attr) {
            var finder;

            if (scope.isSelected) {
                finder = _.find(scope.droplist, function(list) {
                    return scope.isSelected().actUpon(list, scope.eventData);
                });
            }

            scope.itemSelected = finder ? finder.name : false;
            scope.selectedName = finder ? scope.itemSelected : scope.placeholder;

            scope.selectItem = function(index) {
                scope.itemSelected = scope.selectedName = scope.droplist[index].name;
                scope.onChange().actUpon(scope.droplist[index]);
            };
        }
    };
});