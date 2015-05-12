app.factory("Metric", function($http){
  return{
    getMetrics : function(){
      return $http.get('/api/metric').then(function(res){
        console.log('metric stuff', res.data);
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});