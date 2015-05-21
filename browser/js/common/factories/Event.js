app.factory("Event", function($http, NonProfitFactory){
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
        {name : 'Step', value : 'steps', unit : 'steps'},
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
                if (event) {
                    event.startDate = new Date(event.startDate);
                    event.endDate = new Date(event.endDate);
                }
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
            return $http.post('/api/event/' + eventId + '/join').then(function (res) {
                return res.data;
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
            return $http.delete('/api/event/' + eventId + '/leave').then(function (res) {
                return res.data;
            }).catch(function (err) {
                console.log(err);
            });
        },
        sponsorEvent: function (eventId, sponsorDetails) {
            return $http.put('/api/event/' + eventId + '/sponsor', { details: sponsorDetails })
            .then(function (res) {
                return res.data;
            }).catch(function (err) {
                console.log(err);
            });
        },
        getMoreInfoForNonProfits: function (events){
            return NonProfitFactory.getNonprofits().then(function(patients){
                events.forEach(function(event){
                    patients.forEach(function(patient){
                        if(event.patient){
                            if(event.patient.token === patient.token){
                                event.patient.profilePic = patient.profile_url;
                                event.patient.country = patient.country;
                            }
                        }
                    });
                });
                return events;
            });
        }
    };
});