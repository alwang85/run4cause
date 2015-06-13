# Impact Mission

<img src="http://i.imgur.com/3Vbn9HP.png?1"></img>

[Visit impactmission.io](http://impactmission.io/)

Mission Impact allows users to create and participate in events to increase awareness and raise support for third world country patients in need. It standardizes Fitbit/Jawbone API from different units to work seamlessly with our app. Basic Event Driven Architecture triggered by user interactions, and socket.io allows real-time updates when users interact with events and when syncing tracker data.

# Team members: 
- [Sam Chun](https://www.linkedin.com/in/sanghun89)
- [Christian Cueto](https://www.linkedin.com/in/christianmcueto)
- [Alex Wang](https://www.linkedin.com/in/alwang85)
- [Steve Kwak](https://www.linkedin.com/in/steveguac)

# Technical Features:
- Imports/standardized certain predefined metrics from FitBit and Jawbone trackers /w modular code [link](https://github.com/alwang85/run4cause/tree/master/server/db/models)
- Charts showing individual and event progress for different metrics
- Single page Angular app leveraging ui-router hosted on Heroku
- Socket.io to allow real-time client-side chart updating
- Memcached cloud to reduce database calls for single event real-time updates
- JSData to refactor/reduce Angular factories and controllers by 50% +
- Production and development Heroku servers

# Other Libraries/Tools utilized:
Async, bluebird, moment.js, mongoose, lodash, memjs, browserify, gulp, OAuth 2.0, chart.js, Angular ui-router, and the MEAN stack (MongoDB, ExpressJS, AngularJS, Node.js).