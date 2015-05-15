'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('editEvent', {
        url: '/editEvent',
        templateUrl: 'js/editEvent/editEvent.html',
        controller: 'EditEventController'
    });
});

app.controller('EditEventController', function($scope, Event){
    $scope.event = Event.editing.id;
});