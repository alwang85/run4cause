'use strict';
app.directive('eventForm', function (Event, NonProfitFactory) {
    return {
        restrict: 'E',
        scope: {
            event: '='
        },
        templateUrl : 'js/common/directives/event-form/event-form.html',
        link: function(scope, element, attr) {
            scope.actionList = Event.getActions();

            if(scope.event){
                Event.getEvent(scope.event).then(function(event){
                    event.startDate = new Date(event.startDate);
                    event.endDate = new Date(event.endDate);
                    console.log(event)
                    if(event) scope.newEvent = event;
                });
            }

            scope.postEvent = function(anewEvent){
                Event.addEvent(anewEvent).then(function(savedEvent){
                    console.log(savedEvent);
                });
            };

            scope.editEvent = function(newEvent, eventId){
                Event.editEvent(newEvent, eventId).then(function(savedEvent){
                    console.log(savedEvent);
                });
            };

            scope.addGoal = function(newGoal){
                newGoal.category = 'total';
                newGoal.metrics.progress = 0;
                scope.newEvent.goals.push(newGoal);
                scope.newGoal = null;
            };

            scope.getAllPatients = function(){
               return NonProfitFactory.getNonprofits().then(function(patients){
                   scope.patients = patients
               });
            };

            scope.selectPatient = function(selectedPatient){
                scope.newEvent.patient = selectedPatient;
                console.log(selectedPatient);
            };

            scope.newEvent = Event.editFormInit();
        }
    };
});