'use strict';
app.directive('chartDonut', function ($rootScope, $state, $timeout) {
    return {
        restrict : 'E',
        scope: {
            event: '='
        },
        replace: true,
        templateUrl : 'js/common/directives/chart-donut/chart-donut.html',
        link : function(scope, element, attr) {
            var canvas = element.find('canvas')[0];

            $timeout(function() {
                element.height(element.width());
                canvas.width = canvas.height = element.width();
                var context = canvas.getContext('2d');
                var myDoughnutChart = new Chart(context).Doughnut(data,option);
            });
            //element.height(element.offsetWidth);
            //canvas.width = canvas.height = element.offsetWidth;
            var context = canvas.getContext('2d');
            var progress = scope.event.progress;
            var remaining = (progress>1) ? 0 : 1-progress;

            var data = [
                {
                    value: progress,
                    color:"green",
                    highlight: "#FF5A5E",
                    label: "Progress"
                },
                {
                    value: remaining,
                    color: "red",
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
        }
    };
});