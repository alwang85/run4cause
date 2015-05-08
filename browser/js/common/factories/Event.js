app.factory("Event", function($http){
    return{
        addEvent : function(strategyAndEvent){
            return $http.post('/api/event', strategyAndEvent).then(function(res){
                return res.data;
            }, function(err){
                throw new Error(err);
            });
        }
    };
});