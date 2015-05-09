module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/run4cause",
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
    "consumerKey" : "95343780e7c677ed8f687c8eb8e93613",
    "clientID": '229P8R',
    "clientSecret": '88557a229d1ed6e498744888a974eca2',
    "authorizationURL": 'https://www.fitbit.com/oauth2/authorize',
    "tokenURL": 'https://api.fitbit.com/oauth2/token',
    "callbackURL": '/auth/fitbit/callback'
  },
  "JAWBONE" : {
    "clientID": 'jiASw9I4DB0',
    "clientSecret": '8bff16cc6e7f6ed2669aa6a846808007afa3d934',
    "authorizationURL": 'https://jawbone.com/auth/oauth2/auth',
    "tokenURL": 'https://jawbone.com/auth/oauth2/token',
    "callbackURL": '/auth/jawbone/callback'
  }
};