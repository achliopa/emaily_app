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