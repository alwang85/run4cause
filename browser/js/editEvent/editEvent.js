'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('editEvent', {
        url: '/editEvent/:eventID',
        templateUrl: 'js/editEvent/editEvent.html',
        controller: 'EditEventController',
        resolve   : {
            event : function(Event, $stateParams) {
                var eventID = $stateParams.eventID;

                return Event.getEvent(eventID);
            }
        }
    });
});

app.controller('EditEventController', function($scope, event){
    console.log(event);
    $scope.event = event;
});