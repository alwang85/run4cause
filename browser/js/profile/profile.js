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

        $scope.link_devices = _.difference(UserFactory.availableDevices, user.active);

        $scope.linkDevice = function(provider) {
            UserFactory
            .linkDevice(provider, user._id)
            .then(function(user) {
                $scope.user = user;
                $scope.link_devices = _.difference(UserFactory.availableDevices, user.active);
            });
        };

        $scope.updateLogs = function() {
            UserFactory.updateLogs(user._id).then(function(logs) {
                console.log(logs);
            });
        };
    });
});