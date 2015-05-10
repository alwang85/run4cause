'use strict';
app.directive('fontAwesome', function ($rootScope, $state) {
    return {
        restrict : 'E',
        scope : {
            font : '@'
        },
        template : '<i class="fa fa-{{font}}"></i>',
        replace : true
    };
});