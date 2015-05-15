'use strict'

app.config(function($stateProvider){
   $stateProvider.state('message', {
       url: '/message',
       templateUrl: 'js/message/message.html',
       controller: 'MessageController'
   });
});

app.controller('MessageController', function($scope, $state, Message){

    $scope.getAllMessages = function(){
      Message.getAllMessages().then(function(messages){
        $scope.messages = messages;
      });
    }
    $scope.getAllMessages();
    $scope.readMessage = function(messageId){

    }
});