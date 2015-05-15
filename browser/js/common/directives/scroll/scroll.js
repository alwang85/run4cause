app.directive("scroll", function ($window) {
    var linkFunc = function(scope, element, attrs) {
        var offset = parseInt(attrs.scroll) || 60;
        scope.topLevel = true;
        angular.element($window).bind("scroll", function() {
            if (this.scrollY >= offset) {
                scope.topLevel = false;
            } else {
                scope.topLevel = true;
            }
            scope.$apply();
        });
    };

    return {
        restrict : 'A',
        link     : linkFunc
    }
});