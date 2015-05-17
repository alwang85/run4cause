'use strict';
app.directive('eventForm', function (Event, NonProfitFactory) {
    return {
        restrict: 'E',
        scope: {
            event: '=',
            patients: '='
        },
        templateUrl : 'js/common/directives/event-form/event-form.html',
        link: function(scope, element, attr) {
            scope.actionList = Event.getActions();

            var options = scope.event || {
                goals : [{
                    category : "total",
                    metrics  : {
                        unit     : ''
                    }
                }],
                startDate : new Date()
            };

            scope.eventFormData = Event.formInit(options);

            scope.selectActionFunc = function() {
                return {
                    actUpon : function(listItem, goal) {
                        if (listItem.value === goal.metrics.measurement) {
                            goal.metrics.unit = listItem.unit;
                            return true;
                        }
                        return false;
                    }
                };
            };

            scope.updateAction = function(index) {
                return {
                    actUpon : function(action) {
                        scope
                            .eventFormData
                            .goals[index]
                            .metrics
                            .measurement = action.value;

                        scope
                            .eventFormData
                            .goals[index]
                            .metrics
                            .unit = action.unit;
                    }
                };
            };

            scope.eventFormData.duration = 0;
            scope.updateDuration = function() {
                return {
                    actUpon : function(duration) {
                        scope.eventFormData.duration = duration;
                        scope.eventFormData.endDate = new Date(scope.eventFormData.startDate.getTime() + scope.eventFormData.duration);
                    }
                };
            };

            scope.$watch('eventFormData.startDate', function(value) {
                if (scope.eventFormData.duration) {
                    scope.eventFormData.endDate = new Date(value.getTime() + scope.eventFormData.duration);
                }
            });

            submitEvent

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
            };
        }
    };
});