'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($http, $scope, JawboneFactory){
    $scope.getFitbitData = function(){
        $http.get('api/fitbit/getUserSteps').then(function(response){
            console.log(response.data);
        })
    };

    $scope.getJawboneData = function() {
        JawboneFactory.getJawboneData({
            start_time : 0,
            end_time   : 1431030511
        }).then(function(data) {
            console.log(data);
        });
    };
});