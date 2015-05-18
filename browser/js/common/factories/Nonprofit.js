app.factory("NonProfitFactory", function($http, $q){
  var cachedPatientData;
  return{
    getNonprofits : function(){
      return $http.get('/api/nonprofit').then(function(res){
        //console.log('nonprofits', res.data);
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    getNonprofit : function(patientId){
      if (cachedPatientData) return $q.when(cachedPatientData);

      return $http.get('/api/nonprofit/' + patientId).then(function(res){
        cachedPatientData = res.data;
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});