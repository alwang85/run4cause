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
            event : function(EventFactory, $stateParams) {
                var eventID = $stateParams.eventID;
                var Event = EventFactory.DS;
                if (eventID)
                    return Event.find(eventID);
            }
        },
        controller: function($scope, event) {
            $scope.event = event;
        }
    });
});