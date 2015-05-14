'use strict';
app.directive('chartBox', function () {
    return {
        restrict : 'E',
        scope : {
            event: '='
        },
        transclude: true,
        replace : true,
        templateUrl : 'js/common/directives/chart-box/chart-box.html',
        link : function(scope, element, attr, ctrl, transclude) {
            scope.flipped = false;
            scope.boxToggle = function() {
                scope.flipped = !scope.flipped;
            };

            element.css('minHeight', element.outerWidth() + "px");
            transclude(function (clone) {
                element.append(clone);
            });
        }
    };
});

app.directive('boxContainer', function() {
    return {
        restrict : 'E',
        transclude: true,
        replace : true,
        template : '<div class="box-container col-xs-12 col-sm-12 col-md-3 col-lg-3" transclude></div>',
        link : function(scope, element, attr, ctrl, transclude) {
            element.css('minHeight', element.outerWidth() + "px");
            transclude(function (clone) {
                element.append(clone);
            });
        }
    };
});