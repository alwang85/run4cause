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
        $scope.link_devices = user.active;

        $scope.linkDevice = function(provider) {
            UserFactory
            .linkDevice(provider, user._id)
            .then(function(user) {
                $scope.user = user;
                // to filter out which devices are already linked
                //$scope.link_devices = _.difference(UserFactory.availableDevices, user.active);

                // for debugging, having the option to relink
                $scope.link_devices = user.active;
            });
        };

        $scope.updateLogs = function() {
            UserFactory.updateLogs(user._id).then(function(logs) {
                console.log(logs);
            });
        };

        $scope.refreshTokens = function() {
            UserFactory.refreshTokens(user._id).then(function(user) {
                $scope.user = user;
            });
        };
    });
});