'use strict';
app.directive('barChart', function($timeout){
   return{
       restrict: 'E',
       scope: {
           log: '='
       },
       replace: true,
       templateUrl : "js/common/directives/bar-chart/bar-chart.html",
       link: function(scope, element, attr){
           var canvas = element[0];
           //console.log(scope.log);
           var filteredLog = [];
           var filteredDate = [];
           var filteredQty = [];
           scope.log.logData.forEach(function(eachLog){
               var filtered = eachLog.metrics.filter(function(eachMetric){
                   return eachMetric.measurement === attr.metric;
               });
               filteredLog.push({date: new Date(eachLog.date), qty:filtered[0].qty});
           });
           var sortedFiltered = filteredLog.sort(function(a,b){
               return a.date - b.date;
           });
           filteredDate = sortedFiltered.map(function(each){
               return each.date.toString().slice(4,10);
           });
           filteredQty = sortedFiltered.map(function(each){
               if(attr.metric==='distance') return (each.qty/1609.34);
               else return each.qty
           });
           console.log(filteredDate,filteredQty);
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