var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

  //require('../../../server/db/models/message');
  //require('../../../server/db/models/user');
  //require('../../../server/db/models/logs');
  //require('../../../server/db/models/event');

//testing
var Event = require('mongoose').model('Event');
var User = require('mongoose').model('User');
var Logs = mongoose.model('Logs');

describe('Event  model', function(){
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  var user;
  beforeEach('Create temporary user', function (done) {
    user = {
      email: 'obama@gmail.com',
      password: 'potus',
      firstName: 'obama',
      lastName: 'barack'
    };
    User.create(user,function(err, saved){
      if(err) return done(err);
      user = saved;
      done();
    });
  });
  var logs;
  beforeEach('Create logs for user 1', function (done) {
    log = {
      "_id" : ObjectId("555671c95ee90cf6f09bb64e"),
      "user" : user._id,
      "logData" : [
        {
          "date" : ISODate("2015-05-15T00:00:00.000Z"),
          "_id" : ObjectId("555671cc5ee90cf6f09bb64f"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 3219,
              "_id" : ObjectId("55567209db075108f1ea5b27")
            },
            {
              "measurement" : "steps",
              "qty" : 2996,
              "_id" : ObjectId("55567209db075108f1ea5b26")
            },
            {
              "measurement" : "sleep",
              "qty" : 449,
              "_id" : ObjectId("55567209db075108f1ea5b25")
            },
            {
              "measurement" : "calories",
              "qty" : 2507,
              "_id" : ObjectId("55567209db075108f1ea5b24")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-01T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5ade"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5ae2")
            },
            {
              "measurement" : "steps",
              "qty" : 26,
              "_id" : ObjectId("55567209db075108f1ea5ae1")
            },
            {
              "measurement" : "sleep",
              "qty" : 525,
              "_id" : ObjectId("55567209db075108f1ea5ae0")
            },
            {
              "measurement" : "calories",
              "qty" : 2097,
              "_id" : ObjectId("55567209db075108f1ea5adf")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-02T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5ae3"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5ae7")
            },
            {
              "measurement" : "steps",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5ae6")
            },
            {
              "measurement" : "sleep",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5ae5")
            },
            {
              "measurement" : "calories",
              "qty" : 2067,
              "_id" : ObjectId("55567209db075108f1ea5ae4")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-03T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5ae8"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5aec")
            },
            {
              "measurement" : "steps",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5aeb")
            },
            {
              "measurement" : "sleep",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5aea")
            },
            {
              "measurement" : "calories",
              "qty" : 2067,
              "_id" : ObjectId("55567209db075108f1ea5ae9")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-04T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5aed"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5af1")
            },
            {
              "measurement" : "steps",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5af0")
            },
            {
              "measurement" : "sleep",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5aef")
            },
            {
              "measurement" : "calories",
              "qty" : 2067,
              "_id" : ObjectId("55567209db075108f1ea5aee")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-05T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5af2"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5af6")
            },
            {
              "measurement" : "steps",
              "qty" : 26,
              "_id" : ObjectId("55567209db075108f1ea5af5")
            },
            {
              "measurement" : "sleep",
              "qty" : 106,
              "_id" : ObjectId("55567209db075108f1ea5af4")
            },
            {
              "measurement" : "calories",
              "qty" : 2080,
              "_id" : ObjectId("55567209db075108f1ea5af3")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-06T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5af7"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 6437,
              "_id" : ObjectId("55567209db075108f1ea5afb")
            },
            {
              "measurement" : "steps",
              "qty" : 5733,
              "_id" : ObjectId("55567209db075108f1ea5afa")
            },
            {
              "measurement" : "sleep",
              "qty" : 356,
              "_id" : ObjectId("55567209db075108f1ea5af9")
            },
            {
              "measurement" : "calories",
              "qty" : 3658,
              "_id" : ObjectId("55567209db075108f1ea5af8")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-07T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5afc"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 6437,
              "_id" : ObjectId("55567209db075108f1ea5b00")
            },
            {
              "measurement" : "steps",
              "qty" : 5402,
              "_id" : ObjectId("55567209db075108f1ea5aff")
            },
            {
              "measurement" : "sleep",
              "qty" : 479,
              "_id" : ObjectId("55567209db075108f1ea5afe")
            },
            {
              "measurement" : "calories",
              "qty" : 3682,
              "_id" : ObjectId("55567209db075108f1ea5afd")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-08T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b01"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 9656,
              "_id" : ObjectId("55567209db075108f1ea5b05")
            },
            {
              "measurement" : "steps",
              "qty" : 9157,
              "_id" : ObjectId("55567209db075108f1ea5b04")
            },
            {
              "measurement" : "sleep",
              "qty" : 309,
              "_id" : ObjectId("55567209db075108f1ea5b03")
            },
            {
              "measurement" : "calories",
              "qty" : 4575,
              "_id" : ObjectId("55567209db075108f1ea5b02")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-09T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b06"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 6437,
              "_id" : ObjectId("55567209db075108f1ea5b0a")
            },
            {
              "measurement" : "steps",
              "qty" : 5708,
              "_id" : ObjectId("55567209db075108f1ea5b09")
            },
            {
              "measurement" : "sleep",
              "qty" : 547,
              "_id" : ObjectId("55567209db075108f1ea5b08")
            },
            {
              "measurement" : "calories",
              "qty" : 3501,
              "_id" : ObjectId("55567209db075108f1ea5b07")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-10T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b0b"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 1609,
              "_id" : ObjectId("55567209db075108f1ea5b0f")
            },
            {
              "measurement" : "steps",
              "qty" : 2613,
              "_id" : ObjectId("55567209db075108f1ea5b0e")
            },
            {
              "measurement" : "sleep",
              "qty" : 413,
              "_id" : ObjectId("55567209db075108f1ea5b0d")
            },
            {
              "measurement" : "calories",
              "qty" : 2703,
              "_id" : ObjectId("55567209db075108f1ea5b0c")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-11T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b10"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 6437,
              "_id" : ObjectId("55567209db075108f1ea5b14")
            },
            {
              "measurement" : "steps",
              "qty" : 6336,
              "_id" : ObjectId("55567209db075108f1ea5b13")
            },
            {
              "measurement" : "sleep",
              "qty" : 0,
              "_id" : ObjectId("55567209db075108f1ea5b12")
            },
            {
              "measurement" : "calories",
              "qty" : 3678,
              "_id" : ObjectId("55567209db075108f1ea5b11")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-12T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b15"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 6437,
              "_id" : ObjectId("55567209db075108f1ea5b19")
            },
            {
              "measurement" : "steps",
              "qty" : 5730,
              "_id" : ObjectId("55567209db075108f1ea5b18")
            },
            {
              "measurement" : "sleep",
              "qty" : 467,
              "_id" : ObjectId("55567209db075108f1ea5b17")
            },
            {
              "measurement" : "calories",
              "qty" : 3944,
              "_id" : ObjectId("55567209db075108f1ea5b16")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-13T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b1a"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 6437,
              "_id" : ObjectId("55567209db075108f1ea5b1e")
            },
            {
              "measurement" : "steps",
              "qty" : 5529,
              "_id" : ObjectId("55567209db075108f1ea5b1d")
            },
            {
              "measurement" : "sleep",
              "qty" : 448,
              "_id" : ObjectId("55567209db075108f1ea5b1c")
            },
            {
              "measurement" : "calories",
              "qty" : 4294,
              "_id" : ObjectId("55567209db075108f1ea5b1b")
            }
          ]
        },
        {
          "date" : ISODate("2015-05-14T00:00:00.000Z"),
          "_id" : ObjectId("55567209db075108f1ea5b1f"),
          "metrics" : [
            {
              "measurement" : "distance",
              "qty" : 8047,
              "_id" : ObjectId("55567209db075108f1ea5b23")
            },
            {
              "measurement" : "steps",
              "qty" : 6748,
              "_id" : ObjectId("55567209db075108f1ea5b22")
            },
            {
              "measurement" : "sleep",
              "qty" : 459,
              "_id" : ObjectId("55567209db075108f1ea5b21")
            },
            {
              "measurement" : "calories",
              "qty" : 4118,
              "_id" : ObjectId("55567209db075108f1ea5b20")
            }
          ]
        }
      ],
      "__v" : 1
    };
    Logs.create(log,function(err, savedLog){
      if(err) return done(err);
      logs = savedLog;
      done();
    });
  });

  var event;
  beforeEach('Create test event', function (done) {
    event = {
      startDate: ISODate("2015-04-01T00:00:00.000Z"),
      endDate: ISODate("2015-05-15T00:00:00.000Z"),
      lastLogUpdate: ISODate("2015-05-16T00:00:00.000Z"),
      progress: 0,
      goals: [{
        metrics : {
          measurement: distance,
          target: 5000,
          progress: 0
        },
        category: 'total'
      }],
      creator: user._id,
      challengers: [{
        user: user._id,
        individualProgress: 0
      }],
      description: 'this is a running event',
      name: 'run for it'
    };
    Event.create(user,function(err, savedEvent){
      if(err) return done(err);
      event1 = savedEvent;
      done();
    });
  });
  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  it('has a date field of type date',function(done){
    expect(event.date).to.be.instanceOf(Date);
    done();
  });

  it('has an event.creator._id is a string which equals user._id ',function(done){
    expect(event.creator._id.toString()).to.equal(user._id.toString());
    done();
  });



  //it('has a virtual total which is the sum of shipping, tax and subTotal',function(done){
  //  expect(order.details.total).to.equal(order.details.shipping + order.details.tax + order.details.subTotal);
  //  done();
  //});

});
