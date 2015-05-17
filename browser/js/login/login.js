app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login?redirect',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, $stateParams) {

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
        }).catch(function (error) {
            console.log(error);
            $scope.error = 'Invalid login credentials.';
        });

    };

});