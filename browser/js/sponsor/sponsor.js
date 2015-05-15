'use strict'

app.config(function($stateProvider){
  $stateProvider.state('sponsor', {
    url: '/sponsor',
    templateUrl: 'js/sponsor/sponsor.html',
    controller: 'SponsorController'
  });
});

app.controller('SponsorController', function($modalInstance, $state, $scope, Event){
  $scope.sponsorEvent = function(sponsor){
    //console.log('sponsor', sponsor);
    Event.sponsorEvent(Event.editing.id, sponsor.details).then(function(savedEvent){
      $modalInstance.close();
      //$sate.go('') to the event detail page
    });
  };

});