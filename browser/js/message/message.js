'use strict'

app.config(function($stateProvider){
   $stateProvider.state('message', {
       url: '/message',
       templateUrl: 'js/message/message.html',
       controller: 'MessageController'
   });
});

app.controller('MessageController', function($scope, $state, Message, AuthService){
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
    $scope.statuses = [
      'inbox',
      'sent'
    ];
    $scope.currentStatus = 'inbox';
    AuthService.getLoggedInUser().then(function(user){
      $scope.user = user;
    })
    $scope.selectStatus = function(status) {
      if ($scope.currentStatus === status) {
        $scope.currentStatus = null;
        return;
      }
      $scope.currentStatus = status;
    };
});