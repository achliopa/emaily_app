# Section 2

## Lecture 9

* use node v8
* install express with npm 
* use cat to view package.json

## Lecture 12 - Heroku Deploy

* dynamic port binding
* set npm and node version in package.json 
  "engines": {
    "node": "8.4.0",
    "npm": "5.3.0"
  },
* add a start script in package.json
* create .gitignore file for node_module
* create git repo 
* install heroku cli
* verify with heroku -v
* login to heroku : heroku login
* create app in heroku : heroku create <appname>
* push code to heroku : git push heroku master (and deploy)
* for node apps git repo to be pushed must have package.json at root

# Section 3 - Authentication with Google OAuth

## Lecture 19 - Setup Passport.JS

* install passport and strategy to be used:  npm install --save passport passport-google-oauth20
* import libs: const passport =  require('passport'); const GoogleStrategy = require('passport-google-oauth20').Strategy;
* set strategy: passport.use(new GoogleStrategy());
* Sign UP for Google API https://console.developers.google
* Create a new project
* Go to project dashboard
* Enable API (google+ API). click enable. 
* Create credentials => oauth client => configure consent screen
* The only required is app name . all others are optional
* select application type (web application)
*  insert client source: https://emaily-app-achliopa.c9users.io
*  insert authorized page source: https://emaily-app-achliopa.c9users.io/*
*  get the keys . client id / secret (public/private key)
*  store the keys securely on server (un tracked file, env variables)

## Lecture 23 - First attempt to test the flow to Google

*  include them in the call to OAuth with a callback for redirection on success and a callaback function
    to be called when google replies with some data
    passport.use(new GoogleStrategy(
        {
            clientID: keys.googleCLientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        }, (accessToken) => {
            console.log(accessToken);
        })
    );
* we use passport as a middleware. because we use google it will look for google strategy.
* we pass some options specifying to google what access we want to have in the persons profile
* go to /auth/google on a running server => ERROR!!!!!

## Lecture 24-25 - Authorized Redirect URIs

* Debugging with Steve: decypher the google reply 
  error Google reply
  https://accounts.google.com/o/oauth2/v2/auth?
       response_type=code&
       redirect_uri=http%3A%2F%2Femaily-app-achliopa.c9users.io%2Fauth%2Fgoogle%2Fcallback&
       scope=profile%20email&
       client_id=1001208759067-7beqtg5hlrpgevgtnlv56usr13qjk77f.apps.googleusercontent.com
* security related error. the redirect uri must match the key otherwise its prone to hacking
* we need to set properly the redirect uri in google console to be exact match
  https://emaily-app-achliopa.c9users.io/* => 
  https://emaily-app-achliopa.c9users.io/auth/google/callback
* set an express route for the callback uri

# Section 4 - MongoDB to store User Data

## Lecture 32 - ASetup Mongoose

* Mogoose sets model class that represents collection in mongodb
* we use schema model pattern

## Lecture 40 - SerDes User

* Passport serializes deseirializes user to create token

## Lecture 41 - Cookies

* Express doesn't know how to handle cookies
* npm install cookie-session
* import cookiesession
* add cookies to passport and express
    app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

## Lecture 42 - test the flow

* test the flow after authenticating

    app.get('/api/current_user', (req,res) => {
        res.send(req.user); 
    });

* getback

{
_id: "5a17dabc862d350f78eaa5f6",
googleId: "116159247268436008865",
__v: 0
}

* logout
        app.get('/api/logout', (req,res) => {
         req.logout();
         res.send(req.user);
    });

## LEcture 44 - Deep Dive

* if cookie data (session data) is >4kB we should use express-session
* express-session stores a reference to the session object which can be as large as we want