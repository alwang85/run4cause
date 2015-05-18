'use strict';
app.controller('EventsController', function($scope, Event, AuthService) {
    var currentUser;

    AuthService.getLoggedInUser().then(function(user) {
        currentUser = user;
        return user;
    }).then(function(user) {
        return Event.getAllEvents();
    }).then(function(events){
        var filtered = events.filter(function(eachEvent) {
            return eachEvent.creator._id = currentUser._id;
        });
        $scope.events = filtered;
    });
});