'use strict'

app.config(function($stateProvider){
  $stateProvider.state('messageDetail', {
    url: '/messageDetail',
    templateUrl: 'js/message/messageDetail.html',
    controller: 'MessageDetailController'
  });
});

app.controller('MessageDetailController', function($scope, $state, Message){

  $scope.getMessage = function(){
    var targetMessage = Message.currentMessage._id;
    Message.getAllMessages().then(function(messages){
      $scope.message = messages.filter(function(eachMessage){
        return eachMessage._id === targetMessage;
      })[0];
      $scope.message.content = decodeURIComponent($scope.message.content);
    });
  }
  $scope.getMessage();
});