'use strict'

app.config(function($stateProvider){
  $stateProvider.state('sponsor', {
    url: '/sponsor',
    templateUrl: 'js/sponsor/sponsor.html',
    controller: 'SponsorController'
  });
});

app.controller('SponsorController', function($modalInstance, $state, $scope, AuthService, Event){

    $scope.sponsorEvent = function(sponsor) {
        Event.sponsorEvent(Event.editing.id, sponsor.details).then(function(savedEvent){
            $modalInstance.close();
        });
    };


});