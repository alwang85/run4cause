'use strict'

app.config(function($stateProvider){
   $stateProvider.state('event', {
       url: '/impacts',
       templateUrl: 'js/event/event.html',
       controller: 'EventController',
       resolve: {
           user: function (AuthService) {
                return AuthService.getLoggedInUser();
           }
       }
   });
});


app.controller('EventController', function(user, $modal, $state, $scope, Event, Message, SocketFactory, NotifyService){

    $scope.getEvents = function(){
      Event.getAllEvents().then(function (allEvents) {
        return allEvents;
      }).then(function (allEvents) {
        return Event.getMoreInfoForNonProfits(allEvents).then(function (events) {
          $scope.events = events;;
        });
      });
    };
    $scope.getEvents();

    $scope.currentUser = user;
    $scope.sendMessage = function(creatorEmail){
        Message.currentRecipient.email = creatorEmail;
        var modalInstance = $modal.open({
            templateUrl: '/js/message/sendMessage.html',
            controller: 'MessageComposeController',
            size:'md'
        });
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

    $scope.checkSponsoring = function(event){
        var sponsoring = false;
        event.sponsors.forEach(function(sponsor){
            if($scope.currentUser && sponsor.user._id === $scope.currentUser._id) sponsoring = true;
        });
        return sponsoring;
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

    $scope.joinEvent = function(index){
        Event.joinEvent($scope.events[index]._id).then(function(savedEvent){
            NotifyService.notify({
                message : "Joined Impact!"
            });
            var patient = angular.copy($scope.events[index].patient);
            savedEvent.patient = patient;
            $scope.events[index] = savedEvent;
        });
    };

    $scope.leaveEvent = function(index){
        Event.leaveEvent($scope.events[index]._id).then(function(savedEvent){
            NotifyService.notify({
                message : "Left Impact!"
            });
            var patient = angular.copy($scope.events[index].patient);
            savedEvent.patient = patient;
            $scope.events[index] = savedEvent;
        });
    };

    var socket = SocketFactory.getSocket();
    $scope.sponsorEvent = function(event){
        var modalInstance = $modal.open({
            templateUrl: '/js/sponsor/sponsor.html',
            controller: 'SponsorController',
            size:'sm'

        });

        Event.editing.id = event._id;
    };



    socket.on('eventsChange', function(events) {
      $scope.getEvents();
    });
});