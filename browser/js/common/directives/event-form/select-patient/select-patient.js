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
            var gettingPatients = false;

            if (scope.eventForm.patient && scope.eventForm.patient.name) {
                scope.selectedPatient = scope.eventForm.patient;
                scope.placeholder = scope.eventForm.patient.name;
            }

            scope.togglePatientWindow = function() {
                scope.patientSelectToggle = scope.patientSelectToggle ? false : true;
                if (!gettingPatients && !scope.patients) {
                    gettingPatients = NonProfitFactory.getNonprofits().then(function(patients) {
                        scope.patients = patients;
                    });
                }
            };

            scope.selectPatient = function(index) {
                console.log(scope.patients)
                scope.selectedPatient = scope.patients[index];
                console.log(scope.selectedPatient);

                scope.eventForm.patient = {
                    name : scope.selectedPatient.name,
                    token : scope.selectedPatient.token,
                    profile
                };
                scope.placeholder = scope.selectedPatient.name;

                scope.patientSelectToggle = false;
            };
        }
    };
});