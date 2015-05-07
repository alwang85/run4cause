'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($http, $scope, JawboneFactory, FitbitFactory, Users){
    $scope.getFitbitData = function(){
        $http.get('/api/fitbit/getUserSteps').then(function(response){
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
    $scope.getData = function(){
      Users.getCurrentUser().then(function(user){
        if (user.fitbit.id){
          FitbitFactory.getFitbitData.then(function(data){
            console.log('fitbit', data);
          })
        }
        else if (user.jawbone.id){
          JawboneFactory.getJawboneData.then(function(data){
            console.log('jawbone', data);
          })
        }
        else {
          console.log('no sports data');
        }
      });
    };
});