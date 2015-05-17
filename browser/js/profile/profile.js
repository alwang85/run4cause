'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'js/profile/profile.html',
        controller: 'ProfileController'
    });
});

app.controller('ProfileController', function($scope, AuthService, UserFactory) {
    $scope.user = null;
    AuthService.getLoggedInUser().then(function(user){
        $scope.user = user;

        //$scope.link_devices = _.difference(UserFactory.availableDevices, user.active);
        $scope.link_devices = UserFactory.availableDevices;

        $scope.linkDevice = function(provider) {
            UserFactory
            .linkDevice(provider, user._id)
            .then(function(user) {
                $scope.user = user;
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