'use strict';
app.controller('EventsController', function($scope, EventFactory, AuthService, SocketFactory) {
    var currentUser;
    var Event = EventFactory.DS;
     AuthService.getLoggedInUser().then(function(user) {
       currentUser = user;
       return user;
     }).then(function(user) {
       return Event.findAll();
     }).then(function(events){
       var filtered = events.filter(function(eachEvent) {
         return eachEvent.creator._id == currentUser._id;
       });
       $scope.events = filtered;
     });
    var socket = SocketFactory.getSocket();

    socket.on('eventsChange', function(events) {
      getEvent();
    });
});