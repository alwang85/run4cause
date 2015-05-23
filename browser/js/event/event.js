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


app.controller('EventController', function(user, $modal, $state, $scope, EventFactory, Message, SocketFactory, NotifyService){
    var Event = EventFactory.DS;

    Event.bindAll({}, $scope, 'events')
    $scope.getEvents = function(){
      Event.findAll().then(function (allEvents) {
        console.log('getting all events', allEvents);
      });
    };

    $scope.getEvents();

    $scope.refreshEvents = function() {
      Event.findAll({}, {
        bypassCache : true,
        cacheResponse : true
      }).then(function (allEvents) {
        console.log('refreshing all events', allEvents);
      });
    };

    $scope.currentUser = user;
    $scope.sendMessage = function(creatorEmail){
        Message.currentRecipient.email = creatorEmail;
        var modalInstance = $modal.open({
            templateUrl: '/js/message/sendMessage.html',
            controller: 'MessageComposeController',
            size:'md'
        });
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
        Event.destroy(event._id).then(function(status){
          console.log('delete success', status);
        }, function(err){
            console.log(err);
        });
    };
    //
    $scope.joinEvent = function(index){
        Event.update($scope.events[index]._id,{},
          {
            endpoint:'event/join'
          }).then(function(event){
            NotifyService.notify({
            message : "Joined Impact For " + $scope.events[index].patient.name + "!"
            });
          });
    };

    $scope.leaveEvent = function(index){
        Event.update($scope.events[index]._id,{},{
          endpoint: 'event/leave'
        }).then(function(savedEvent){
            NotifyService.notify({
                message : "Left Impact?! Don't Leave For " + $scope.events[index].patient.name + "!"
            });
        });
    };

    var socket = SocketFactory.getSocket();
    $scope.sponsorEvent = function(event){
        var modalInstance = $modal.open({
            templateUrl: '/js/sponsor/sponsor.html',
            controller: 'SponsorController',
            size:'sm',
            resolve : {
                eventData : function() {
                    return event;
                },
                sponsorUser : function() {
                    return $scope.currentUser;
                }
            }
        });
    };
    $scope.refreshEventById = function(eventId){
        Event.refresh(eventId, {
            cacheResponse : true
        }).then(function(updatedEvent){
            console.log("attempting to refresh", updatedEvent);
        });
    };

    socket.on('eventUpdate', function(eventId) {
      $scope.refreshEventById(eventId); //user join updates many events
    });

    socket.on('eventsChange', function(events) {
      $scope.refreshEvents(); //user join updates many events
    });
});