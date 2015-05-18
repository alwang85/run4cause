'use strict';
app.directive('dashboardNav', function ($rootScope, $state) {
    return {
        restrict : 'E',
        scope : {},
        templateUrl : 'js/dashboard/dashboard-nav/dashboard-nav.html',
        link : function(scope) {
            scope.items = [
                { icon : 'heartbeat', label : 'Events', state : 'dashboard.events'},
                { icon : 'user', label : 'Profile', state : 'dashboard.profile'}
            ];

            scope.isCurrentState = function(current) {
                return $state.includes(current);
            };
        }
    };
});