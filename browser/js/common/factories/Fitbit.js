'use strict';
app.factory('FitbitFactory', function($http) {
  var getFitbitData= function(params) { // param takes in date
    return $http.get('/api/fitbit/getUserData').then(function(response) {
      return response.data
    });
  };

  return {
    getFitbitData : getFitbitData
  };
});