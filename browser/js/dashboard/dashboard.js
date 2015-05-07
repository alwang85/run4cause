'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashboardController'
    });
});

app.controller('DashboardController', function($http, $scope){
    $scope.Grid = {
        dimensions: [6, 2]
    };
});