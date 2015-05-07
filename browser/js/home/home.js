'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($http, $scope){
    $scope.getFitbitData = function(){
        $http.get('/api/fitbit/getUserSteps').then(function(response){
            console.log(response.data);
        })
    }
});