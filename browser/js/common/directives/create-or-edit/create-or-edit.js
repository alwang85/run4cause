'use strict';
app.directive('createOrEdit', function (Event, NonProfitFactory) {
    return {
        restrict: 'E',
        scope: {
            event: '='
        },
        templateUrl : 'js/common/directives/create-or-edit/create-or-edit.html',
        link: function(scope) {
            if(scope.event){
                Event.getEvent(scope.event).then(function(event){
                    event.startDate = new Date(event.startDate);
                    event.endDate = new Date(event.endDate);
                    console.log(event)
                    if(event) scope.newEvent = event;
                });
            }

            //Nonprofit.getNonprofits().then(function(nonprofitList){
            //    scope.nonprofitList = nonprofitList;
            //});

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

            scope.newEvent = new ANewEvent();
            function ANewEvent () {
                this.category = null;
                this.goals = [];
                this.group = true;
                this.startDate = null;
                this.endDate = null;
                this.name = null;
                this.description = null;
                this.nonProfit = null;
                this.patient = null;
                this.sponsor = null;
                this.pledgedAmount = null;
                this.progress = 0;
            }
        }
    };
});