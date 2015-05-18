'use strict';
app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, Message) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Events', state: 'event'},
                { label: 'Dashboard', state: 'dashboard.events', auth: true },
                { label: 'Inbox', state: 'message', auth: true },
                { label: 'Profile', state: 'profile', auth: true},
                { label: 'Patients', state: 'nonProfit.home'}
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var checkUnread = function(){
              Message.getAllMessages().then(function(messages){
                scope.unread = messages.some(function(message){
                  return message.read === false;
                });
              });
            };
            checkUnread();

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    if (user) {
                        scope.user = user;
                    }
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();
            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                scope.isHome = $state.$current.includes.home;
                checkUnread();
            });

            $rootScope.$on('$viewContentLoaded', function(event) {
                scope.isHome = $state.$current.includes.home;
            });
        }

    };

});