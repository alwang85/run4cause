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
        $scope.link_devices = ['jawbone', 'fitbit'];

        $scope.linkDevice = function(provider) {
            UserFactory
            .linkDevice(provider, user._id)
            .then(function(user) {
                $scope.user = user;
                // to filter out which devices are already linked
                $scope.link_devices = _.difference(UserFactory.availableDevices, user.active);
            });
        };

        $scope.updateLogs = function() {
            UserFactory.updateLogs().then(function(logs) {
                console.log(logs);
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