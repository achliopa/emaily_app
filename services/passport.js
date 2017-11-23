const passport =  require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys  = require('../config/keys');


// we set a arrow callback to be called when the google rplies with some data
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleCLientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: 'https://emaily-app-achliopa.c9users.io/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log('access token: ', accessToken);
        console.log('refresh token: ', refreshToken);
        console.log('profile: ', profile);
    })
);