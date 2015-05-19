'use strict'

app.config(function($stateProvider){
   $stateProvider.state('event', {
       url: '/event',
       templateUrl: 'js/event/event.html',
       controller: 'EventController',
       resolve: {
           user: function (AuthService) {
                return AuthService.getLoggedInUser();
           }
       }
   });
});

app.controller('EventController', function(UserFactory, user, $modal, $state, $scope, Event, Message){
    Event.getAllEvents().then(function (allEvents) {
        return allEvents;
    }).then(function (allEvents) {
        return Event.getMoreInfoForNonProfits(allEvents).then(function (events) {
            $scope.events = events;
        });
    });
    $scope.currentUser = user;
    $scope.sendMessage = function(creatorEmail){
        Message.currentRecipient.email = creatorEmail;
        var modalInstance = $modal.open({
            templateUrl: '/js/message/sendMessage.html',
            controller: 'MessageComposeController',
            size:'md'

        });
    };
    $scope.editEvent = function(eventId) {
        Event.editing.id = eventId;
        $state.go('editEvent');
    };
    $scope.currentEventMetrics = function(event){
        var metrics = [];
        event.goals.forEach(function(goal){
            metrics.push(goal.metrics.measurement)
        });
        return metrics;
    };
    $scope.checkParticipation = function(event){
        var participating = false;
        event.challengers.forEach(function(challenger){
            if($scope.currentUser && challenger.user._id === $scope.currentUser._id) participating = true;
        });
        return participating
    };
    $scope.deleteEvent = function(event){
        Event.deleteEvent(event._id).then(function(status){
           $scope.events = $scope.events.filter(function(eachEvent){
               return eachEvent._id !== event._id;
           })
        }, function(err){
            console.log(err);
        });
    };
    $scope.joinEvent = function(event){
        Event.joinEvent(event._id).then(function(savedEvents){
            return savedEvents;
        }).then(function() {
            return Event.getAllEvents().then(function(allEvents){
                return allEvents;
            });
        }).then(function(allEvents) {
            console.log(allEvents);
            Event.getMoreInfoForNonProfits(allEvents).then(function(eventsWithInfo) {
                $scope.events = eventsWithInfo;
            });
        });
    };

    $scope.leaveEvent = function(event){
        Event.leaveEvent(event._id).then(function(savedEvents){
            return savedEvents;
        }).then(function() {
            return Event.getAllEvents().then(function(allEvents){
                return allEvents;
            });
        }).then(function(allEvents) {
            console.log(allEvents);
            Event.getMoreInfoForNonProfits(allEvents).then(function (eventsWithInfo) {
                $scope.events = eventsWithInfo;
            });
        });
    };
    $scope.sponsorEvent = function(event){
        var modalInstance = $modal.open({
            templateUrl: '/js/sponsor/sponsor.html',
            controller: 'SponsorController',
            size:'sm'

        });

        Event.editing.id = event._id;

    };

});