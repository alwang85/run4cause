'use strict';
app.controller('SponsorController', function($modalInstance, $scope, EventFactory, eventData, NotifyService){
  var Event = EventFactory.DS;
    $scope.sponsorEvent = function(sponsor) {
        Event.update(eventData._id, sponsor, {
          endpoint: 'event/sponsor'
        }).then(function(newSponsor){
          //eventData.sponsors.push(newSponsor);
          NotifyService.notify({
            message : "Sponsored " + eventData.patient.name + "!"
          });
          $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});