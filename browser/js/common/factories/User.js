app.factory("User", function($http){
    return{
        getCurrentUser : function(){
            return $http.get('/session').then(function(res){
                return res.data.user;
            }, function(err){
                throw new Error(err);
            });
        }
    }
});