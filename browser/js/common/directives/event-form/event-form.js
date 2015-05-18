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
            // get available action lists
            scope.actionList = Event.getActions();

            var options = scope.event || {
                goals : [{
                    category : "total",
                    metrics  : {
                        measurement : '',
                        target     : 0
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

            scope.submitEvent = function(impactData) {
                if (scope.event) {
                    Event.editEvent(impactData, scope.event._id).then(function(savedEvent){
                        console.log(savedEvent);
                    });
                } else {
                    Event.addEvent(impactData).then(function(savedEvent){
                        console.log(savedEvent);
                    });
                }
            };

            scope.addGoal = function() {
                scope.eventFormData.goals.push({
                    category : "total",
                    metrics  : {
                        unit     : ''
                    }
                });
            };

            scope.removeGoal = function(index) {
                scope.eventFormData.goals.splice(index, 1);
            };
        }
    };
});