app.factory("Challenge", function($http){
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
    }
  };
});