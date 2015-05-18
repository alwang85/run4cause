'use strict'

app.config(function($stateProvider){
   $stateProvider.state('message', {
       url: '/message',
       templateUrl: 'js/message/message.html',
       controller: 'MessageController'
   });
});

app.controller('MessageController', function($scope, $state, Message){
    $scope.messages;
    $scope.getAllMessages = function(){
      Message.getAllMessages().then(function(messages){
        $scope.messages = messages;
      });
    };
    $scope.getAllMessages();
    $scope.readMessage = function(messageId){
      Message.currentMessage._id = messageId;
      Message.markRead(messageId);
      $state.go('messageDetail');
    };
});