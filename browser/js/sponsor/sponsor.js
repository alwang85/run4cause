'use strict';
app.controller('SponsorController', function($modalInstance, $scope, Event, eventData, NotifyService){
    $scope.sponsorEvent = function(sponsor) {
        Event.sponsorEvent(eventData._id, sponsor.details).then(function(newSponsor){
            eventData.sponsors.push(newSponsor);
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