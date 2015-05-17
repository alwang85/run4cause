app.factory("Event", function($http, AuthService){
    var eventForm = {
        goals : [],
        group : true,
        startDate : null,
        endDate : null,
        name : null,
        description : null,
        patient : null,
        sponsor : [],
        pledgedAmount : null,
        progress : 0
    };

    var actionList = [
        {name : 'Run', value : 'distance', unit : 'miles'},
        {name : 'Burn', value : 'calories', unit : 'cal'}
    ];

    return {
        formInit : function(options) {
            return _.merge({}, eventForm, options);
        },
        getActions : function() {
            return actionList;
        },
        editing: {},
        addEvent: function (event) {
          return $http.post('/api/event', event).then(function (res) {
            return res.data;
          }).catch(function (err) {
            console.log(err);
          });
        },
        editEvent: function (newEvent, eventId) {
          return $http.put('/api/event/' + eventId, newEvent).then(function (res) {
            return res.data;
          }).catch(function (err) {
            console.log(err);
          });
        },
        getEvent: function (eventId) {
          return $http.get('/api/event/' + eventId).then(function (res) {
            return res.data
          }).then(function(event) {
              event.startDate = new Date(event.startDate);
              event.endDate = new Date(event.endDate);
              return event;
          }).catch(function (err) {
            console.log(err);
          });
        },
        getAllEvents: function () {
          return $http.get('/api/event').then(function (res) {
            return res.data;
          }).catch(function (err) {
            console.log(err);
          });
        },
        joinEvent: function (eventId) {
          return AuthService.getLoggedInUser().then(function (currentUser) {
            return currentUser;
          }).then(function (currentUser) {
            return $http.post('/api/event/' + eventId + '/join', {userId: currentUser._id}).then(function (res) {
              return res.data;
            })
          }).catch(function (err) {
            console.log(err);
          });
        },
        deleteEvent: function (eventId) {
          return $http.delete('/api/event/' + eventId).then(function (res) {
            return res.data
          }).catch(function (err) {
            console.log(err);
          });
        },
        leaveEvent: function (eventId) {
          return AuthService.getLoggedInUser().then(function (currentUser) {
            return currentUser
          }).then(function (currentUser) {
            return $http.put('/api/event/' + eventId + '/join', {userId: currentUser._id}).then(function (res) {
              return res.data;
            }).catch(function (err) {
              console.log(err);
            })
          })
        },
        sponsorEvent: function (eventId, sponsorDetails) {
          return AuthService.getLoggedInUser().then(function (currentUser) {
            return currentUser;
          }).then(function (currentUser) {
            return $http.put('/api/event/' + eventId + '/sponsor', {userId: currentUser._id, details: sponsorDetails}).then(function (res) {
              return res.data;
            }).catch(function (err) {
              console.log(err);
            })
          })
        }
    };
});