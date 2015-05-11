'use strict';
var chart;
app.directive('chartDonut', function ($rootScope, $state, $timeout) {
    return {
        restrict : 'E',
        replace: true,
        templateUrl : 'js/common/directives/chart-donut/chart-donut.html',
        link : function(scope, element, attr) {
            var canvas = element.find('canvas')[0];
            element.height(element.width());
            canvas.width = canvas.height = element.width();
            var context = canvas.getContext('2d');

            var data = [
                {
                    value: 80,
                    color:"#F7464A",
                    highlight: "#FF5A5E",
                    label: "Progress"
                },
                {
                    value: 20,
                    color: "#46BFBD",
                    highlight: "#5AD3D1",
                    label: "Remaining"
                }
            ];

            var option = {
                segmentShowStroke : true,
                showScale: true,
                scaleShowLabels: true,
                scaleFontSize: 20,
                percentageInnerCutout : 90
            };

            var myDoughnutChart = new Chart(context).Doughnut(data,option);
        }
    };
});