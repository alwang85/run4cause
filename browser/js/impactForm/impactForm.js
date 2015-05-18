app.config(function ($stateProvider) {
    $stateProvider.state('impactForm', {
        url: '/impactForm',
        abstract : true,
        templateUrl: 'js/impactForm/impactForm.html',
        resolve   : {
            patients : function(NonProfitFactory) {
                return NonProfitFactory.getNonprofits();
            }
        },
        controller: function($scope, patients) {
            $scope.patients = patients;
        }
    });

    $stateProvider.state('impactForm.create', {
        url: '',
        template: '<event-form patients="patients"></event-form>'
    });

    $stateProvider.state('impactForm.edit', {
        url: '/:eventID',
        template: '<event-form event="event" patients="patients"></event-form>',
        resolve : {
            event : function(Event, $stateParams) {
                var eventID = $stateParams.eventID;

                if (eventID)
                    return Event.getEvent(eventID);
                else
                    return;
            }
        },
        controller: function($scope, event) {
            $scope.event = event;
        }
    });
});