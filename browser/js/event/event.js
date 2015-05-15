'use strict'

app.config(function($stateProvider){
   $stateProvider.state('event', {
       url: '/event',
       templateUrl: 'js/event/event.html',
       controller: 'EventController'
   });
});

app.controller('EventController', function($scope, Event){

    Event.getAllEvents().then(function(events){
        console.log(events);
        $scope.events = events;
    });
    $scope.joinEvent = function(eventId){
        Event.joinEvent(eventId).then(function(){

        });
    };
});