bower'use strict';
app.factory('JawboneFactory', function($http) {
  var getJawboneData= function(params) { // param takes in date
    return $http.get('/api/jawbone/getUserData', {
      params : params
    }).then(function(response) {
      return response.data
    });
  };

  return {
    getJawboneData : getJawboneData
  };
});