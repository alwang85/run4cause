app.factory("Event", function($http){
    return{
        addEvent : function(strategyAndEvent){
            return $http.post('/api/event', strategyAndEvent).then(function(res){
                return res.data;
            }, function(err){
               console.log(err);
            });
        },
        getEvent : function(userId){
            return $http.get('/api/event', {params: {userId:userId}}).then(function(res){
                return res.data;
            }, function(err){
                console.log(err);
            });
        }
    };
});