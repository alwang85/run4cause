app.factory("EventFactory", function($http, Patient, DS){
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

  var event = {
    name: 'event',
    idAttribute: '_id'
  };




    return {
      DS: DS.defineResource(event),
      formInit : function(options) {
        return _.merge({}, eventForm, options);
      },
      getActions : function() {
        return actionList;
      }
    };
});