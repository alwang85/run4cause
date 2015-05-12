app.factory("NewEvent", function($http){
  return{
    addEvent : function(event){
      return $http.post('/api/event', event).then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    getEvent : function(){
      return $http.get('/api/event').then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});