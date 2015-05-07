'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashboardController'
    });
});

app.controller('DashboardController', function($http, $scope){
    $scope.myGridLayoutOptions = {
        dimensions: [2, 2]
    };

    $scope.grids = [{bgColor: "orange"}, {bgColor: "red"}, {bgColor: "green"}, {bgColor: "yellow"}]
});