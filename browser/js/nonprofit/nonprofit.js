app.config(function ($stateProvider) {

    $stateProvider.state('nonProfit', {
        url: '/nonProfit',
        abstract : true,
        templateUrl: 'js/nonprofit/nonprofit.html',
        controller: 'NonProfitController'
    });

    $stateProvider.state('nonProfit.leaderboard', {
        url: '',
        templateUrl: 'js/nonprofit/partial/leaderboard.html'
    });

    $stateProvider.state('nonProfit.detail', {
        url: '/:nonProfitToken',
        templateUrl: 'js/nonprofit/partial/detail.html'
    });
});

app.controller('NonProfitController', function ($scope, AuthService, NonProfitFactory, $state) {
    $scope.nonprofits= [];

    NonProfitFactory.getNonprofits()
    .then(function(nonprofits) {
        $scope.nonprofits = nonprofits;
    });
    $scope.getPatient = function(patientId){
      console.log('scopegetPatient', patientId);
      NonProfitFactory.getNonprofit(patientId).then(function(patient){
        $scope.patient = patient;
      });
      console.log($state);
    };
    console.log($state);
});