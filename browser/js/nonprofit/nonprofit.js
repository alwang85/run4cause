app.config(function ($stateProvider) {

    $stateProvider.state('nonProfit', {
        url: '/nonProfit',
        abstract : true,
        templateUrl: 'js/nonprofit/nonprofit.html',
        controller: 'NonProfitController'
    });

    $stateProvider.state('nonProfit.home', {
        url: '',
        templateUrl: 'js/nonprofit/partial/leaderboard.html'
    });

    $stateProvider.state('nonProfit.detail', {
        url: '/:nonProfitToken',
        templateUrl: 'js/nonprofit/partial/detail.html',
        controller: function($scope, Patient, $state, $stateParams){
          if (!$scope.patient){
            console.log('thhese are the passed params', $stateParams.nonProfitToken)
            Patient.find($stateParams.nonProfitToken).then(function(patient){
              $scope.patient = patient;
            });
          }
            //Patient.getNonprofit($stateParams.nonProfitToken).then(function(patient){
            //    $scope.patient = patient;
            //});
        }
    });
});


app.controller('NonProfitController', function ($scope, AuthService, DS, $state, Patient) {
    //DS.findAll('patient').then(function(patients){
    //  console.log(patients);
    //  $scope.nonprofits = patients;
    //}); didn't work!!

    Patient.findAll().then(function(patients){
      console.log(patients);
      $scope.nonprofits = patients;
    })
    $scope.getPatient = function(patientId){
        Patient.find(patientId).then(function(patient){
          console.log('foundPatient', patient);
          $scope.patient = patient;
          $state.go("nonProfit.detail",{nonProfitToken:patientId});
        });
    };










    //$scope.nonprofits= [];
    //$scope.patient = {};
    //
    //NonProfitFactory.getNonprofits()
    //.then(function(nonprofits) {
    //    $scope.nonprofits = nonprofits;
    //});
    //$scope.getPatient = function(patientId){
    //  NonProfitFactory.getNonprofit(patientId).then(function(patient){
    //    $scope.patient = patient;
    //    $state.go("nonProfit.detail",{nonProfitToken:patientId});
    //  });
    //};
});