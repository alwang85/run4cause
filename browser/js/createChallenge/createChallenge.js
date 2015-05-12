'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('createChallenge', {
        url: '',
        templateUrl: 'js/createChallenge/createChallenge.html',
        controller: 'CreateChallengeController'
    });
});


app.controller('CreateChallengeController', function($modal, $modalInstance, $http, $scope, Event, Metric, Challenge){
    $scope.closeModal = function(newChallenge){
        Challenge.addChallenge(newChallenge);

        $modalInstance.close();
    };
    Metric.getMetrics().then(function(metricList){
      $scope.metricList = metricList;
    });

    $scope.newChallenge = new NewChallenge();

    function NewChallenge () {
        this.metric = null;
        this.category = null;
        this.startDate = null;
        this.endDate = null;
        this.name = null;
        this.description = null;
        this.goal = null;
    }

});