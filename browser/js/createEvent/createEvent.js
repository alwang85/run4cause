'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('createEvent', {
        url: '/createEvent',
        templateUrl: 'js/createEvent/createEvent.html',
        controller: 'CreateEventController'
    });
});

app.controller('CreateEventController', function($modalInstance, $http, $scope, User, Event){
    $scope.closeModal = function(){
        $modalInstance.close();
    };
});