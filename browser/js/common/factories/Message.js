app.factory("Message", function($http, AuthService){
  return{
    currentMessage:{},
    getAllMessages : function(){
      return AuthService.getLoggedInUser().then(function(currentUser){
        return currentUser;
      }).then(function(currentUser){
        return $http.get('/api/message/'+currentUser._id).then(function(res){
          return res.data;
        })
      }).catch(function(err){
        console.log('err at getAllMessages', err);
      });
    },
    sendMessage : function(message) {
      return $http.post('/api/message/', message).then(function (res) {

        return res.data;
      })
    }
  };
});