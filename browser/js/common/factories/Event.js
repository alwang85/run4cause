app.factory("Event", function($http, AuthService){
  return {
    editing: {},
    addEvent: function (event) {
      return $http.post('/api/event', event).then(function (res) {
        return res.data;
      }, function (err) {
        console.log(err);
      });
    },
    editEvent: function (newEvent, eventId) {
      return $http.put('/api/event/' + eventId, newEvent).then(function (res) {
        return res.data;
      }, function (err) {
        console.log(err);
      });
    },
    getEvent: function (eventId) {
      return $http.get('/api/event/' + eventId).then(function (res) {
        return res.data
      }, function (err) {
        console.log(err);
      })
    },
    getAllEvents: function () {
      return $http.get('/api/event').then(function (res) {
        return res.data;
      }, function (err) {
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