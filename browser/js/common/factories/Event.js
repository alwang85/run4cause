app.factory("Event", function($http, AuthService){
  return{
    addEvent : function(event){
      return $http.post('/api/event', event).then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    getAllEvents : function(){
      return $http.get('/api/event').then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    joinEvent : function(eventId){
      return AuthService.getLoggedInUser().then(function(currentUser){
        return currentUser;
      }).then(function(currentUser){
        return $http.post('/api/event/'+eventId+'/join', {userId:currentUser._id}).then(function(res){
          return res.data;
        })
      }).catch(function(err){
        console.log(err);
      });
    }
  };
});