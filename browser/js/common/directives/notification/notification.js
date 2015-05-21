app.directive('notification', function(NotifyService, $timeout) {
     return {
         restrict    : 'E',
         scope       : {},
         templateUrl : 'js/common/directives/notification/notification.html',
         link        : function(scope, element, attr) {
             scope.status = '';
             scope.message = '';
             scope.notificationToggle = false;

             NotifyService.registerNotify(function(notifyOpt) {
                 scope.status = notifyOpt.status ? notifyOpt.status : scope.status;
                 scope.message = notifyOpt.message ? notifyOpt.message : scope.message;
                 scope.notificationToggle = true;

                 $timeout(function() {
                     scope.notificationToggle = false;
                 }, 2000);
             });
         }
     }
});

app.service("NotifyService", function() {
    var service = this;
    service.notifyRegistry = [];

    service.registerNotify = function(func) {
        service.notifyRegistry.push(func);
    };

    service.notify = function(notifyOpt) {
        _.forEach(service.notifyRegistry, function(fn) {
            fn(notifyOpt);
        });
    };
});