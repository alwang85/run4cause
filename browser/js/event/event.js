'use strict'

app.config(function($stateProvider){
   $stateProvider.state('event', {
       url: '/event',
       templateUrl: 'js/event/event.html',
       controller: 'EventController'
   });
});

app.controller('EventController', function($scope, NewEvent){
    $scope.getAllEvents = function(){
        NewEvent.getAllEvents().then(function(events){
            console.log(events);
            $scope.events = events;
        });
    };
});