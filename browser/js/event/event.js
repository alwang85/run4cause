'use strict'

app.config(function($stateProvider){
   $stateProvider.state('event', {
       url: '/event',
       templateUrl: 'js/event/event.html',
       controller: 'EventController'
   });
});

app.controller('EventController', function($state, $scope, Event){

    Event.getAllEvents().then(function(events){
        console.log(events);
        $scope.events = events;
    });
    $scope.editEvent = function(eventId) {
        Event.editing.id = eventId;
        $state.go('editEvent');
    };
    $scope.deleteEvent = function(event){
        Event.deleteEvent(event._id).then(function(status){
            console.log(status);
           $scope.events = $scope.events.filter(function(eachEvent){
               return eachEvent._id !== event._id;
           })
        }, function(err){
            console.log(err);
        });
    };
    $scope.joinEvent = function(event){
        Event.joinEvent(event._id).then(function(savedEvent){
            console.log(savedEvent);
        }).then(function(){
                if(event.progress!=savedEvent.progress) event.progress = savedEvent.progress;
            });
    };
    $scope.leaveEvent = function(event){
        Event.leaveEvent(event._id).then(function(savedEvent){
            console.log(savedEvent);
        }).then(function(){
            Event.getAllEvents().then(function(events){
                if(event.progress!=savedEvent.progress) event.progress = savedEvent.progress;
            });
        })
    };
});