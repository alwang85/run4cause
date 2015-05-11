'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('createEvent', {
        url: '/createEvent',
        templateUrl: 'js/createEvent/createEvent.html',
        controller: 'CreateEventController'
    });
});

app.controller('CreateEventController', function($modal, $http, $scope, Event){
    $scope.openModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'js/createChallenge/createChallenge.html',
            controller: 'CreateChallengeController',
            size: 'lg'
        })
    };
    $scope.categories = [];

    $scope.newEvent = new NewEvent();

    function NewEvent () {
        this.challenges = [];
        this.category = null;
        this.group = true;
        this.contest = true;
        this.startDate = null;
        this.endDate = null;
        this.name = null;
        this.description = null;
    }

});