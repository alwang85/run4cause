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
                scope.selectedPatient = _.find(scope.patients, function(patient) {
                    return patient.name === scope.eventForm.patient.name;
                });

                scope.placeholder = scope.selectedPatient.name;
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