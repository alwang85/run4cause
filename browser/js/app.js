'use strict';
var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt', 'satellizer', 'ui.bootstrap']);

// base url provider
app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

app.constant("Client", {
   "jawbone" : {
       "client_id" : "jiASw9I4DB0",
       "authorizationURL": 'https://jawbone.com/auth/oauth2/auth',
       "scope" : ['basic_read', 'sleep_read', 'move_read']
    },
    "fitbit" : {
        "client_id" : "229P8R",
        "authorizationURL": 'https://api.fitbit.com/oauth2/authorize',
        "scope" : ['activity', 'sleep', 'profile']
    }
});

// base auth provider
app.config(function($authProvider, Client) {
    $authProvider.oauth2({
        url  : '/api/user/device',
        name : 'jawbone',
        clientId: Client.jawbone.client_id,
        authorizationEndpoint : Client.jawbone.authorizationURL,
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        scope: Client.jawbone.scope,
        requiredUrlParams: ['scope'],
        scopeDelimiter: ' '
    });

    $authProvider.oauth2({
        url  : '/api/user/device',
        name : 'fitbit',
        clientId: Client.fitbit.client_id,
        authorizationEndpoint : Client.fitbit.authorizationURL,
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        scope: Client.fitbit.scope,
        requiredUrlParams: ['scope'],
        scopeDelimiter: ' ',
        popupOptions: { width: 527, height: 582 }
    });

    $authProvider.loginRedirect = null;
    $authProvider.tokenName = 'user';
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, InitialLoadService, UserFactory, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    InitialLoadService.loadInit().runLoad().then(function(logs) {
        console.log(logs);
    });

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.

            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                var redirectTo = {};
                if (toState.name) {
                    redirectTo.redirect = toState.name;
                }
                $state.go('login', redirectTo);
            }
        });

    });

});