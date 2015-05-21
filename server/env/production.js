/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production

 */

module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "TWITTER": {
        "consumerKey": process.env.TWITTER_CONSUMER_KEY,
        "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
        "callbackUrl": process.env.TWITTER_CALLBACK
    },
    "FACEBOOK": {
        "clientID": process.env.FACEBOOK_APP_ID,
        "clientSecret": process.env.FACEBOOK_CLIENT_SECRET,
        "callbackURL": process.env.FACEBOOK_CALLBACK_URL
    },
    "GOOGLE": {
        "clientID": process.env.GOOGLE_CLIENT_ID,
        "clientSecret": process.env.GOOGLE_CLIENT_SECRET,
        "callbackURL": process.env.CALLBACK_URL
    },
  "FITBIT": {
    "consumerKey" : process.env.FITBIT_KEY,
    "clientID": process.env.FITBIT_CLIENT,
    "clientSecret": process.env.FITBIT_CLIENT_SECRET,
    "authorizationURL": 'https://www.fitbit.com/oauth2/authorize',
    "tokenURL": 'https://api.fitbit.com/oauth2/token',
    "refreshTokenURL" : "https://api.fitbit.com/oauth2/token",
    "callbackURL": '/auth/fitbit/callback'
  },
  "JAWBONE" : {
    "clientID": process.env.JAWBONE_CLIENT,
    "clientSecret": process.env.JAWBONE_CLIENT_SECRET,
    "authorizationURL": 'https://jawbone.com/auth/oauth2/auth',
    "tokenURL": 'https://jawbone.com/auth/oauth2/token',
    "refreshTokenURL" : "https://jawbone.com/auth/oauth2/token",
    "callbackURL": '/auth/jawbone/callback'
  },
  "MEMCACHEDCLOUD": {
    "SERVERS": process.env.MEMCACHEDCLOUD_SERVERS,
    "USERNAME": process.env.MEMCACHEDCLOUD_USERNAME,
    "PASSWORD": process.env.MEMCACHEDCLOUD_PASSWORD
  }
};