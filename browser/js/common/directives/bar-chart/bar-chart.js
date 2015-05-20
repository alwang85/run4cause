'use strict';
app.directive('barChart', function($timeout, UserFactory){
   return{
       restrict: 'E',
       scope: {
           log: '='
       },
       replace: true,
       templateUrl : "js/common/directives/bar-chart/bar-chart.html",
       link: function(scope, element, attr){
           var canvas = element[0];
           var filteredLog;
           var filteredDate;
           var filteredQty;
           var currentMetric = attr.metric;

           filteredLog = UserFactory.currentUserLogs(scope.log.logData)[currentMetric];
           filteredDate = UserFactory.sortAndSliceDate(filteredLog);
           filteredQty = UserFactory.sortAndFilterQty(filteredLog, currentMetric);

           var context = canvas.getContext('2d');
           var data = {
               labels: filteredDate,
               datasets: [
                   {
                       label: "My First dataset",
                       fillColor: "rgba(220,220,220,0.2)",
                       strokeColor: "rgba(220,220,220,1)",
                       pointColor: "rgba(220,220,220,1)",
                       pointStrokeColor: "#fff",
                       pointHighlightFill: "#fff",
                       pointHighlightStroke: "rgba(220,220,220,1)",
                       data: filteredQty
                   }
               ]
           };
           var option = {
               scaleShowGridLines : false,
               scaleBeginAtZero : true,
               scaleShowHorizontalLines : false,
               scaleGridLineColor : 'rgb(54, 70, 93)'
           };



           $timeout(function() {

               var myBarChart = new Chart(context).Line(data,option);
           });


       }
   };
});