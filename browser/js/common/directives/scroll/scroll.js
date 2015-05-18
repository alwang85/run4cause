app.directive("scroll", function ($window) {
    var linkFunc = function(scope, element, attrs) {
        var offset = parseInt(attrs.scroll) || 60;

        scope.scrollOffSetExceeded = false;
        angular.element($window).bind("scroll", function() {
            if (this.scrollY >= offset) {
                scope.scrollOffSetExceeded = true;
            } else {
                scope.scrollOffSetExceeded = false;
            }
            scope.$apply();
        });
    };

    // couldn't do isolated scope because
    // this link function's scope needs to access
    // scrollOffSetExceeded property of its controller
    return {
        restrict : 'A',
        link     : linkFunc
    }
});