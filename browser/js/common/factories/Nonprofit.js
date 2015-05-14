app.factory("NonProfitFactory", function($http){
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
      //console.log('nonprofitfactory', patientId);
      return $http.get('/api/nonprofit/' + patientId).then(function(res){
        //console.log('nonprofits', res.data);
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});