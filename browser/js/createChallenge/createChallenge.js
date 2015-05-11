'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('createChallenge', {
        url: '',
        templateUrl: 'js/createChallenge/createChallenge.html',
        controller: 'CreateChallengeController'
    });
});


app.controller('CreateChallengeController', function($modal, $modalInstance, $http, $scope, Event){
    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.newChallenge = new NewChallenge();

    function NewChallenge () {
        this.metric = null;
        this.category = null;
        this.startDate = null;
        this.endDate = null;
        this.name = null;
        this.description = null;
    }

});