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
        url: '/nonprofitID',
        templateUrl: 'js/nonprofit/partial/detail.html'
    });
});

app.controller('NonProfitController', function ($scope, AuthService, NonProfitFactory) {
    $scope.events= [];

    NonProfitFactory.getNonprofits()
    .then(function(nonprofits) {
        $scope.events = nonprofits;
    });
});