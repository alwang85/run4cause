app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login?redirect',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, AUTH_EVENTS, $state, $stateParams, $rootScope) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo, $stateParams.redirect).then(function (user) {
            if ($stateParams.redirect) {
                var redirectState = $state.get($stateParams.redirect);
            } else {
                $state.go('home');
            }
            $rootScope.$broadcast(AUTH_EVENTS.loginPostSuccess, user);
        }).catch(function (error) {
            console.log(error);
            $scope.error = 'Invalid login credentials.';
        });

    };

});