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

# Section 5

## Lecture 45 - Dev & Prod

* always have separate db and keys between prod and dev.
* prod keys should be stored in prod server not on dev machine
* create prod mongodb and prod api for google
* create a switch file for keys.js - commit to git
* move env vars for dev in dev.js - dont commit
* point to process.env vars in prod.js - commit
* in heroku set process.env vas for prod
* callback URL complains when running server behing proxy. it treat https as http.
* either pass complete path as parameter or set proxy:tue in passport config

# Section 6 - Switch to CLient Side and React

## LEcture 51 - THe easy way 

* use create-react-app
* sudo npm install -g create-react-app
* inside the server directory run: create-react-app client
* sit back and wait

## Lecture 52 - Separate FrontEnd Server

* run npm start in client folder
* change h2 in src/app.js
* why 2 servers? to harness the simplisity of create-react-app to start learning react
* merging two could be feasible

## Lecture 53 - Running Together Client and Server

* kill the client , go to server folder
* install concurrently with npm
* in package.json add scripts for client run and concurrent run
    "scripts": {
    "start": "node index.js",
    "server": "nodemon index.js",
    "client": "npm run start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""

## Lecture 54 - Routing

* In the react app we want to have a link that says sign in with googleOAuth (localhost:5000/auth/google)
* we add <a href="/auth/google">Sign in with Google</a> in client/src/App.js react component
* it routes to localhost:3000/auth/google which we dont want
* we replace with <a href="http://localhost:5000/auth/google">Sign in with Google</a> and it works
* hardcoded is not a solution, dynamic replace is also not elegant
* fix for this: in clients package.json we add 
    "proxy": {
    "/auth/google" : {
      "target": "http://localhost:5000"
    }
  },
* we need to add http://localhost:3000/auth/google to the google developers console AND add callback to the 3000 in passport to direct redirection to 3000

## Lecture 55 - React App Proxy how-to

* when browser wants bundle.js it goes to react app (3000)
* when browser asks api data we go the roxy instead
  (depenting on the relative path if it is added to proxy script in package.json)
* proxy then redirects it to the backend server ap (express) runnin gon port 5000
* in production mode, react app does not exist as a separate runtime listening to anothe rport as the bundle is trasformed into public assets running on express so the server is one not two
* we can verify this by going to the client dir and running npm run build
* this creates build folder
* then we render index from express

## Lecture 56 - Deep Dive in Create React App Architecture

* when pointing to a second domain from the browser the broswer by default do not add cookies to these requests (for security). if browser is at localhost:3000 and we try to access data in localhost:5000
* using proxy in dev mode soves this issue
* browser ahas tools to send cross-domain cookies (advanced)
* trying to acess resources on a different domain is a CORS request 
(Cross Origin Request Sharing), browser treats it as malicious, security issue/ .proxy solves it

# Section 7 - Building the CLient

## Lecture 57 - Async/Await

* ES2017 fetch('http://rallycoding.herokuapp.com/api/music_albums') to fetch data from apis . returns promise
* async/await is ES2017 syntax . use babel for back compatibility

## Lecture 59 - FrontEnd vs BackEnd

* split functionality into frontend and backend
* always work on one component on one side

## Lecture 60 - Setting up React on Client Side

* delete all files from client/src folder except registerServiceWorker.js file. NO BOILERPLATES
* we want two root files. (index.js) data layer control, bootup login (REDUX)
(app.js) rendering layer control (REACT)
* install dependencies: in client side!!
npm install --save redux react-redux react-router-dom
* create index.js in client/src folder
* if file exports class or React component starts with capital letter otherwise small
* express looks for index.js in src

## Lecture 63 - React/Redux

* Redux store passes into React Comps by Provider tag in root element
* boilerplating. create a dummy redux store and pass it to root jsx with provider tag
const store = createStore(() => [], {}, applyMiddleware());

## Lecture 64 - Auth Reducer

* the reason of adding index.js in reducers folder is to import all files by a single import (node style)
* we create empty auth reducer and add it to redux store in index.js in src

## Lecture 66 - Auth Reducer

* keeps the state of being logged in
* impacts content on header (Login/Logout render)
* avaialble routes also are impacted

## Lecture 67 - React Routing

* import BrowserRouter and ROute from react-router-dom
* create dummy compopnnents
* breowserrouter takes only one child compnent. so wrap routes in div
* jsx syntax... exact <=> exact={true}

## Lecture 71 - Use 3rd party CSS library

* www.materializecss.com
** partial compatibility with react
** html javascript components not react components
** needs integration effort to react for javascript components
** css styling

* http://www.material-ui.com/#/
** react based 
** javascript styling , hard to customize
** more difficult to overwrite styling properties with javascript than with css

* add materializecss
** npm install --save materialize-css in client side (server/client)

## Lecture 72 - Webpack and CSS

* webpack handles non javascript files using loaders
* create react app makes it easier
** actual css file is in node-modules/materialize-css/dist
** i choose the minified version
** i add import statement in index.js for css file. webpack knows it is a css file and treats it accordingly
** we need to specify file extension in non js imports
** it doesnt matter where you put it

## Lecture 73 - Styling the Header

* add a navbar according to http://next.materializecss.com/navbar.html
to thest integration of css
* mateializecss assumes you have a root element
with clasname container

## Lecture 74 - Change header if user is logged in

* in server/routes/authRoutes.js we defined a route api/current_user where we expect to see a user id in the html params
* we use redux state store and action generators to implement it

## Lecture 75 - Proxy Rules

* action generator goes to backend express api to fetch user and then dispatches a redux action to update redux store
* we use axios library to fetch backend using ajax request
* we use redux thunk to make asynchronous redux actions
* in client we install axios and redux-thunk
npm install --save axios redux-thunk
* we wire up redux thunk in our client app
** we import it in index.js and pass it as a middleware in redux createStore method call
we create an action creator
* we create index.js and types.js in client/src/actions folder
* we import axios in index.js
* we create fetch user function (action creator/generator) and fire a axios get call to current user api relative path in backend server (relative because we have the proxy), we add a second rule in proxy key rule in client side package.json file

## Lecture 76 - Redux Thunk

* plain reux expects that any action creator will immediately create an action (return it)
* dispatch fuction role is to send the actions
to the reducers
* redux thunk gives us direct access to the dispatch function
* so in essence it allows us to dispatch an action at any point in time (async)
* we refactor the action creator using redux-thunk. thunk is a middleware so always runs checking what the action creator returns. if it returns a function it calls it with dispatch as an argument giving us the ability to call dispatch when we are ready

## Lecture 77 - Refactor the app

* we use the newly created action creator to a react component
* we choose to add it to the App component (as we expect multiple child components to care if user is signed in or not)
* we refactor App from functional to class Component
* we call fetch user method in a React Component lifecycle method: componentDidMount() which is called at initialization (onetimer)
* we use connect from react-redux to pass redux actions as react component props
* we refactor fetchUser to pure ES2017 async/await and export it
* we care only for res.data object so we change the dispatch payload param to res.data

## Lecture 80 - authReducer return val

* we add the action to the authReudcer refactoring it to implement a state machine. null = dont know, user = got logged in, false -= not logged in

## Lecture 81 - Accessing state in Header

* we do this with connect and map state to props param
* we add a function to render text in header depending on state
* we use throttling from chrome dev tools (network) to test state transition at app startup using slow connection

## Lecture 83 - Redirect User on Auth

*  passport is a middleware . it process every single request
* it finishes and pashes control to nowhere therefore the error
* this all happens in server side routes (authroutes.js)
* we use express redirect to move back to the client side

## Lecture 84 - Redirect on Logout

* the AJAX way using React-Redux is faster but needs implementation on reducer, action creation etc
* we do full http request for simplicity

## Lecture 86 - Link Tags

* we use react router Link tag