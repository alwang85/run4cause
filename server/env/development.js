module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/fsg-app",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "INSERT_TWITTER_CONSUMER_KEY_HERE",
    "consumerSecret": "INSERT_TWITTER_CONSUMER_SECRET_HERE",
    "callbackUrl": "INSERT_TWITTER_CALLBACK_HERE"
  },
  "FACEBOOK": {
    "clientID": "INSERT_FACEBOOK_CLIENTID_HERE",
    "clientSecret": "INSERT_FACEBOOK_CLIENT_SECRET_HERE",
    "callbackURL": "INSERT_FACEBOOK_CALLBACK_HERE"
  },
  "GOOGLE": {
    "clientID": "INSERT_GOOGLE_CLIENTID_HERE",
    "clientSecret": "INSERT_GOOGLE_CLIENT_SECRET_HERE",
    "callbackURL": "INSERT_GOOGLE_CALLBACK_HERE"
  },
  "FITBIT": {
    "consumerKey": "ff371f465c88938d041bd3fa32e8fca2",
    "consumerSecret": "fcd83ddb7a22814ad7abcc95500f0c2b",
    "callbackURL": "http://localhost:1337/auth/fitbit/callback"
  },
  "JAWBONE" : {
    "clientID": 'jiASw9I4DB0',
    "clientSecret": '8bff16cc6e7f6ed2669aa6a846808007afa3d934',
    "authorizationURL": 'https://jawbone.com/auth/oauth2/auth',
    "tokenURL": 'https://jawbone.com/auth/oauth2/token',
    "callbackURL": 'http://localhost:1337/auth/jawbone/callback'
  }
};