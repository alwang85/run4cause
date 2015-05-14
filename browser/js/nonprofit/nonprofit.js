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
        templateUrl: 'js/nonprofit/partial/detail.html',
        controller: function($scope, NonProfitFactory, $state, $stateParams){
            NonProfitFactory.getNonprofit($stateParams.nonProfitToken).then(function(patient){
                $scope.patient = patient;
            });
        }
    });
});


app.controller('NonProfitController', function ($scope, AuthService, NonProfitFactory, $state) {
    $scope.nonprofits= [];
    $scope.patient = {};

    NonProfitFactory.getNonprofits()
    .then(function(nonprofits) {
        $scope.nonprofits = nonprofits;
    });
    $scope.getPatient = function(patientId){
      NonProfitFactory.getNonprofit(patientId).then(function(patient){
        //$scope.patient = patient;
        //$state.go("nonProfit.detail",{nonProfitToken:patientId});
      });
    };
});