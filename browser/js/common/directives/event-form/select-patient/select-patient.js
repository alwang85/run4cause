app.directive('selectPatient', function(NonProfitFactory) {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : 'js/common/directives/event-form/select-patient/select-patient.html',
        scope    : {
            eventForm : '='
        },
        link : function(scope) {
            scope.placeholder = "WHO ?";
            scope.selectedPatient = null;
            scope.patientSelectToggle = false;

            scope.patients = [];
            NonProfitFactory.getNonprofits().then(function(patients){
                scope.patients = patients;
            });

            scope.togglePatientWindow = function() {
                scope.patientSelectToggle = scope.patientSelectToggle ? false : true;
            };

            scope.selectPatient = function(index) {
                scope.selectedPatient = scope.patients[index];

                scope.eventForm.patient = {
                    name : scope.selectedPatient.name,
                    token : scope.selectedPatient.token
                };
                scope.placeholder = scope.selectedPatient.name;

                scope.patientSelectToggle = false;
            };
        }
    };
});