'use strict'

app.config(function($stateProvider){
  $stateProvider.state('sponsor', {
    url: '/sponsor',
    templateUrl: 'js/sponsor/sponsor.html',
    controller: 'SponsorController'
  });
});

app.controller('SponsorController', function($state, $scope, Event){
  $scope.sponsorEvent = function(sponsor){
    console.log('sponsor', sponsor);
    Event.sponsorEvent(Event.editing, sponsor.details).then(function(savedEvent){
      console.log('savedEvent', savedEvent);
    });
  };

});