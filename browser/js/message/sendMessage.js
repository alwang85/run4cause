'use strict'

app.config(function($stateProvider){
  $stateProvider.state('messageCompose', {
    url: '/messageCompose',
    templateUrl: 'js/message/sendMessage.html',
    controller: 'MessageComposeController'
  });
});

app.controller('MessageComposeController', function($scope, $state, Message){
  $scope.sendMessage = function(message) {
    Message.sendMessage(message).then(function(){
      $state.go('message');
    })
  };
});