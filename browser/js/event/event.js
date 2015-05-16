'use strict'

app.config(function($stateProvider){
   $stateProvider.state('event', {
       url: '/event',
       templateUrl: 'js/event/event.html',
       controller: 'EventController',
       resolve: {
           events: function (Event) {
               return Event.getAllEvents();
               }
           }
   });
});

app.controller('EventController', function(AuthService, events, $modal, $state, $scope, Event, NonProfitFactory){
    $scope.events = events;
    console.log(events);
    AuthService.getLoggedInUser().then(function(user){
            $scope.currentUser = user
        });
    NonProfitFactory.getNonprofits().then(function(patients){
      $scope.events.forEach(function(event){
         patients.forEach(function(patient){
             if(event.patient){
                 if(event.patient.token === patient.token){
                     event.patient.profilePic = patient.profile_url;
                     event.patient.country = patient.country;
                 }
             }
         });
      });
    });
    Event.getAllEvents().then(function(events){
        $scope.events = events;
    });
    $scope.editEvent = function(eventId) {
        Event.editing.id = eventId;
        $state.go('editEvent');
    };
    $scope.checkParticipation = function(event){
        var participating = false;
        event.challengers.forEach(function(challenger){
            if(challenger.user._id===$scope.currentUser) participating = true;
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
        Event.joinEvent(event._id).then(function(savedEvent) {
            Event.getAllEvents().then(function (events) {
                console.log("events after join", events)
                $scope.events = events;
            });
        })
    };
    $scope.leaveEvent = function(event){
        Event.leaveEvent(event._id).then(function(savedEvent){
            Event.getAllEvents().then(function(events){
                console.log("events after leave", events)
                $scope.events = events;
            });
        })
    };
    $scope.sponsorEvent = function(event){
        var modalInstance = $modal.open({
            templateUrl: '/js/sponsor/sponsor.html',
            controller: 'SponsorController',
            size:'lg'
        });
        Event.editing.id = event._id;
    };
});