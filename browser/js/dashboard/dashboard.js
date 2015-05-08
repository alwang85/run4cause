'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashboardController'
    });
});

app.controller('DashboardController', function($http, $scope, User){
    $scope.myGridLayoutOptions = {
        dimensions: [2, 2]
    };
    $scope.currentUserLog;
    $scope.userChallenges = ['1','2'];
    User.getCurrentUser().then(function(user){
        console.log(user);
        $scope.currentUserLog = user.log;
    });

    $scope.grids = [{bgColor: "orange"}, {bgColor: "red"}, {bgColor: "green"}, {bgColor: "yellow"}]

    var options = {
        bezierCurve: false,
        animationEasing : "easeOutBounce"
    };
    // Get context with jQuery - using jQuery's .get() method.
    // had to setTimeout since ng-repeat loads before jquery functions load
    // Let Steve know if you find better solutions
    setTimeout (function(){
        $scope.userChallenges.forEach(function(each, index){
            var data = [
                {
                    value: 300,
                    color:"#F7464A",
                    highlight: "#FF5A5E",
                    label: "Red"
                },
                {
                    value: 50,
                    color: "#46BFBD",
                    highlight: "#5AD3D1",
                    label: "Green"
                },
                {
                    value: 100,
                    color: "#FDB45C",
                    highlight: "#FFC870",
                    label: "Yellow"
                }
            ];
            var ctx = $(".myChart").get(index).getContext("2d");
            var myDoughnutChart = new Chart(ctx).Doughnut(data,options);
        });
    },100)
});