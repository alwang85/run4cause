app.config(function ($stateProvider) {
    $stateProvider.state('impactForm', {
        url: '/impactForm',
        abstract : true,
        templateUrl: 'js/impactForm/impactForm.html'
    });

    $stateProvider.state('impactForm.create', {
        url: '',
        template: '<event-form></event-form>'
    });

    $stateProvider.state('impactForm.edit', {
        url: '/:eventID',
        template: '<event-form event="event"></event-form>',
        resolve : {
            event : function(Event, $stateParams) {
                var eventID = $stateParams.eventID;

                if (eventID)
                    return Event.getEvent(eventID);
            }
        },
        controller: function($scope, event) {
            $scope.event = event;
        }
    });
});