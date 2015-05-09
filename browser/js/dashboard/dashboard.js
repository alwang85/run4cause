'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashboardController'
    });
});

app.controller('DashboardController', function($modal, $http, $scope, User, Event){
    $scope.myGridLayoutOptions = {
        dimensions: [2, 2]
    };

    $scope.modalOpen = function(){
        //$state.go('home');
        var modalInstance = $modal.open({
            templateUrl: '/js/createEvent/createEvent.html',
            controller: 'CreateEventController',
            size: 'lg'
        });
    };

    //$scope.showBackTrigger = function(){
    //    if(!$scope.showBack) {
    //        $scope.showBack = true;
    //    }
    //    else $scope.showBack = false;
    //}

    // Get context with jQuery - using jQuery's .get() method.
    // had to setTimeout since ng-repeat loads before jquery functions load
    // Let Steve know if you find better solutions
    //setTimeout (function(){
    //    $scope.userChallenges.forEach(function(eachChallenge, index){
    //        var progress = {
    //            calories: {
    //                amount: 0,
    //                percentage: 0
    //            },
    //            steps: {
    //                amount: 0,
    //                percentage: 0
    //            },
    //            distance: {
    //                amount: 0,
    //                percentage: 0
    //            },
    //            sleep: {
    //                amount: 0,
    //                percentage: 0
    //            }
    //        };
    //
    //
    //        var dateFilteredLog = $scope.currentUserLog.filter(function(eachLog){
    //            return eachLog.date>=eachChallenge.startDate && eachLog.date<=eachChallenge.endDate;
    //        });
    //        dateFilteredLog.forEach(function(eachLog){
    //            eachLog.metrics.forEach(function(eachMetric){
    //                progress[eachMetric.measurement].amount+=eachMetric.qty;
    //            });
    //        });
    //        for(var eachProgress in progress){
    //            for(var eachMetric in eachChallenge.strategy){
    //                if(eachMetric===eachProgress){
    //                    progress[eachProgress].percentage = parseInt(progress[eachProgress].amount)/parseInt(eachChallenge.strategy[eachMetric]);
    //                }
    //            }
    //        }
    //
    //        var getTotalPercentage = function(){
    //            return (progress.calories.percentage +progress.steps.percentage+progress.distance.percentage+progress.sleep.percentage)/4;
    //        };
    //
    //        var data = [
    //            {
    //                value: getTotalPercentage().toFixed(2),
    //                color:"#F7464A",
    //                highlight: "#FF5A5E",
    //                label: "Progress"
    //            },
    //            {
    //                value: (1-getTotalPercentage()).toFixed(2),
    //                color: "#46BFBD",
    //                highlight: "#5AD3D1",
    //                label: "Remaining"
    //            }
    //        ];
    //
    //        var option = {
    //            segmentShowStroke : true,
    //            showScale: true,
    //            scaleShowLabels: true,
    //            scaleFontSize: 20,
    //            scaleLabel: "<%=value%>"
    //        };
    //        var data2 = {
    //            labels: ["January", "February", "March", "April", "May", "June", "July"],
    //            datasets: [
    //                {
    //                    label: "My First dataset",
    //                    fillColor: "rgba(220,220,220,0.5)",
    //                    strokeColor: "rgba(220,220,220,0.8)",
    //                    highlightFill: "rgba(220,220,220,0.75)",
    //                    highlightStroke: "rgba(220,220,220,1)",
    //                    data: [65, 59, 80, 81, 56, 55, 40]
    //                }
    //            ]
    //        };
    //
    //        var ctx = $(".myChart").get(index).getContext("2d");
    //        var myDoughnutChart = new Chart(ctx).Doughnut(data,option);
    //        //var ctx = $(".myChartB").get(index).getContext("2d");
    //        //var myBarChart = new Chart(ctx).Bar(data2,{ barShowStroke: false});
    //    });
    //},1000)
});