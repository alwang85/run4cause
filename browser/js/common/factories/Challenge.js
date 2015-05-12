app.factory("Challenge", function($http, AuthService, Session){
  return{
    addChallenge : function(challenge){
      return $http.post('/api/challenge', challenge).then(function(res){
        console.log(res.data)
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
        console.log('session.user', Session.user)
        return AuthService.getLoggedInUser().then(function(currentUser){
          return currentUser;
        }).then(function(user){
              return $http.get('/api/challenge', {params: {user: user._id}}).then(function(res){
                  console.log('this is res.data', res.data)
                return res.data;
              });
            });

    }
  };
});