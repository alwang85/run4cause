app.directive('dateInput', function() {
    return {
        restrict : 'E',
        scope    : {
            eventForm : '='
        },
        replace : true,
        templateUrl : 'js/common/directives/event-form/date-input/date-input.html',
        link : function(scope, element, attr) {
            function parseDate(dateObj) {
                var month = dateObj.getMonth();
                month = month + 1 > 9 ?  (month + 1).toString() : "0" + (month + 1).toString();

                var date = dateObj.getDate();
                date = date > 9 ?  date.toString() : "0" + date.toString();

                return month + '/' + date + '/' + dateObj.getFullYear();
            }
            scope.startDate = parseDate(scope.eventForm.startDate);
            scope.$watch('startDate', function(value) {
                scope.eventForm.startDate = new Date(value);
            });
        }
    };
});

app.directive('dateFormat', function() {
    return {
        restrict : 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            var el = element[0];
            var formatInDate = function(text) {
                var numInput = text.replace(/[^0-9|^/]/g, '');
                var numArray = numInput.split('/');


                _.forEach(numArray, function(date_component, index) {
                    var sliceLen = 2;
                    if (index > 1) {
                        sliceLen = 4;
                    }
                    if (date_component.length > sliceLen && !numArray[index+1] && index < 2) {
                        numArray[index+1] = date_component.slice(sliceLen);
                    }
                    numArray[index] = date_component.slice(0, sliceLen);
                });
                numInput = numArray.join('/');

                if(numInput !== text) {
                    ngModelCtrl.$setViewValue(numInput);
                    ngModelCtrl.$render();
                }

                return numInput;
            };

            ngModelCtrl.$parsers.push(formatInDate);
        }
    };
});