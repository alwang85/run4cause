app.factory('UserFactory', function($http, $q, $auth) {
    var currentUserLogs = function(logData){
        var userLogByMetrics = {
            distance: [],
            calories: [],
            steps: [],
            sleep: []
        };
        var filteredDate = [];
        var filteredQty = [];
        logData.forEach(function(eachLog){
            eachLog.metrics.forEach(function(eachMetric){
                userLogByMetrics[eachMetric.measurement].push({
                    date: new Date(eachLog.date),
                    qty: eachMetric.qty
                })
            })
        });
        return userLogByMetrics;
    };
    var sortArrayByDate = function(filteredLog){
        return filteredLog.sort(function(a,b){
            return a.date - b.date;
        });
    };

    var sortAndSliceDate = function(filteredLog){
        return sortArrayByDate(filteredLog).map(function(each){
            return each.date.toString().slice(4,10);
        });
    };

    var sortAndFilterQty = function(filteredLog, metric){
        return sortArrayByDate(filteredLog).map(function(each){
            if(metric==='distance') return (each.qty/1609.34).toFixed(1);
            else return each.qty.toFixed(0);
        });
    };

    var aggregateUserLogByCategory = function(userLog){
        var objToReturn = {
            startDate: null,
            endDate: null,
            distance: 0,
            steps: 0,
            calories: 0,
            sleep: 0
        };

        if (userLog.length > 0) {
            for(var metric in userLog){
                objToReturn.startDate = userLog[metric][0].date;
                objToReturn.endDate = userLog[metric][userLog[metric].length-1].date;
                userLog[metric].forEach(function(eachDay){
                    if(metric === 'distance') objToReturn[metric] += (eachDay.qty/1609.34);
                    else objToReturn[metric] += +eachDay.qty;
                });
            }
        }
        return objToReturn;
    };

    var createNewUser = function(newUser) {
        return $http.post('/api/user/signup', newUser)
            .then(function(response) {
                return response.body;
            })
            .catch(function(response) {
                return $q.reject({message : 'Unable to Sign Up'});
            });
    };

    var linkDevice = function(provider, user) {
        return $auth.authenticate(provider, {
            user : user,
            provider : provider
        })
        .then(function(response) {
            return response.data.user;
        })
        .catch(function(err) {
            console.log(err);
        });
    };

    var disconnectDevice = function(provider) {
        return $http.delete('/api/user/device/' + provider).then(function(response) {
            return response.data;
        });
    };

    var updateLogs = function() {
        return $http.put('/api/user/logs/').then(function(response) {
            return response.data;
        });
    };

    var refreshTokens = function() {
        return $http.put('/api/user/tokens/').then(function(response) {
            return response.data;
        });
    };

    var getUserLogs = function() {
        return $http.get('/api/user/logs/').then(function(response) {
            return response.data;
        });
    };
    // available api to link
    var availableDevices = ['jawbone', 'fitbit'];

    return {
        sortArrayByDate: sortArrayByDate,
        aggregateUserLogByCategory: aggregateUserLogByCategory,
        sortAndFilterQty: sortAndFilterQty,
        sortAndSliceDate: sortAndSliceDate,
        currentUserLogs: currentUserLogs,
        createNewUser : createNewUser,
        availableDevices : availableDevices,
        linkDevice : linkDevice,
        disconnectDevice: disconnectDevice,
        refreshTokens : refreshTokens,
        updateLogs : updateLogs,
        getUserLogs : getUserLogs
    };
});