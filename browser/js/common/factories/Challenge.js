app.factory("Challenge", function($http, AuthService){
  return{
    addChallenge : function(challenge){
      return $http.post('/api/challenge', challenge).then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    getChallenges : function(){ //TODO should filter by user created challenges
      return $http.get('/api/challenge').then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    },
    getChallengesByUser : function(){ //TODO should filter by user created challenges
      var user;
      if (AuthService.isAuthenticated()) {
        AuthService.getLoggedInUser().then(function(currentUser){
          user = currentUser;
        })
      }
      return $http.get('/api/challenge', {params: {user: user}}).then(function(res){
        return res.data;
      }, function(err){
        console.log(err);
      });
    }
  };
});