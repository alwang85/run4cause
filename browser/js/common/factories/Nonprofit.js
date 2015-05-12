app.factory("Nonprofit", function($http){
  return{
    getNonprofits : function(){
      return $http.get('/api/nonprofit').then(function(res){
        //console.log('nonprofits', res.data);
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});