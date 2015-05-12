app.factory("NewEvent", function($http){
  return{
    addEvent : function(event){
      return $http.post('/api/newEvent', event).then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    getAllEvents : function(){
      return $http.get('/api/newEvent').then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});