const passport =  require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys  = require('../config/keys');
const mongoose = require('mongoose');
// our model class
const User = mongoose.model('users'); 


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(null, user);
    });
});

// we set a arrow callback to be called when the google rplies with some data
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleCLientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: keys.callbackURI
        // correct solution proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        // console.log('access token: ', accessToken);
        // console.log('refresh token: ', refreshToken);
        // console.log('profile: ', profile);
        User.findOne({googleId: profile.id})
        .then((existingUser) => {
            if (existingUser) {
                // we already have a record with this id
                done(null, existingUser);
            } else {
                new User({googleId: profile.id}).save()
                /* second model instance comes in the promise, use the one in the promise
                as it is the most fresh one */
                .then((user) => {
                    done(null, user);
                });                
            }
        });
    })
);