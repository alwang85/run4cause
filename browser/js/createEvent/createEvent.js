'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('createEvent', {
        url: '/createEvent',
        templateUrl: 'js/createEvent/createEvent.html',
        controller: 'CreateEventController'
    });
});

app.controller('CreateEventController', function($modal, $http, Event, $scope, Nonprofit, Challenge){
    $scope.openModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'js/createChallenge/createChallenge.html',
            controller: 'CreateChallengeController',
            size: 'lg'
        })
    };
    $scope.categories = [];
    Nonprofit.getNonprofits().then(function(nonprofitList){
      $scope.nonprofitList = nonprofitList;
    });

    $scope.postEvent = function(anewEvent){
        Event.addEvent(anewEvent).then(function(savedEvent){
            console.log(savedEvent);
        });
    };

    $scope.newEvent = new ANewEvent();
    Challenge.getChallengesByUser().then(function(challenges){
       $scope.newEvent.challenges = challenges;
    });
    function ANewEvent () {
        this.challenges = [];
        this.category = null;
        this.group = true;
        this.contest = true;
        this.startDate = null;
        this.endDate = null;
        this.name = null;
        this.description = null;
        this.nonProfit = null;
    }

});