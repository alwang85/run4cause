'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('profile', {
        url: '/profile',
        abstract : true,
        templateUrl: 'js/profile/profile.html',
        controller: 'ProfileController',
        data : {
            authenticate : true
        },
        resolve : {
            logs: function(UserFactory){
                    return UserFactory.getUserLogs().then(function(log) {
                       return log;
                    });

            }
        }
    });
    $stateProvider.state('profile.events', {
        url: '',
        templateUrl: 'js/dashboard/events/events.html',
        controller: 'EventsController'
    });
    $stateProvider.state('profile.main', {
        url: ''
    });

});

app.controller('ProfileController', function(logs, $scope, AuthService, UserFactory, LoadService) {
    $scope.user = null;
    $scope.showDate = false;
    $scope.user_log = logs;
    $scope.currentMetric = 'distance';
    AuthService.getLoggedInUser().then(function(user){
        $scope.user = user;
        //$scope.link_devices = _.difference(UserFactory.availableDevices, user.active);
        $scope.link_devices = UserFactory.availableDevices;
        var userLog = UserFactory.currentUserLogs(logs.logData);

        for(var metric in userLog){
            userLog[metric] = UserFactory.sortArrayByDate(userLog[metric]);
            if (userLog[metric].length > 0) {
                userLog[metric].forEach(function(each) {
                    each.date = each.date.toString().slice(4, 10);
                });
            }
        };
        $scope.currentUserLogs = UserFactory.aggregateUserLogByCategory(userLog);
        $scope.linkDevice = function(provider) {
            UserFactory
            .linkDevice(provider, user._id)
            .then(function(user) {
                LoadService.initLoad(user);
            });
        };

        $scope.disconnectDevice = function(provider) {
            UserFactory
            .disconnectDevice(provider)
            .then(function(user) {
                    console.log(user);
                $scope.user = user;
            });
        };

        $scope.updateLogs = function() {
            UserFactory.updateLogs().then(function(logs) {
                $scope.user_log = logs;
            });
        };

        $scope.refreshTokens = function() {
            UserFactory.refreshTokens().then(function(user) {
                $scope.user = user;
            });
        };

        $scope.getUserLogs = function() {
            UserFactory.getUserLogs().then(function(log) {
                $scope.user_log = log;

            });
        };
    });
});

app.controller('DashboardController', function($modal, $http, $scope) {
    $scope.modalOpen = function () {
        //$state.go('home');
        var modalInstance = $modal.open({
            templateUrl: '/js/createEvent/createEvent.html',
            controller: 'CreateEventController',
            size: 'lg'
        });
    };
});