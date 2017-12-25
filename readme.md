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

# Section 9 - Payments with Stripe

## Lecture 88 - Billing Considerations

* We are bad at security
** NEVER accept raw credit card numbers
** NEVER store credit card numbers
** ALWAYS use an outside payment processor
* Billing is Hard
** Possible to avoid monthly payments/multiple plans?
** Fraud and chargebacks are a pain

* Recurly is based on stripe to handle monthly payments

## Lecture 89 - Stripe billing process

* billing form is a stripe api
** user enters credit card
** data are sent by form to stripe
** stripe sends back a token
** we send token to our api
** our api confrms the charge was successful to stripe
** we add credits to user axccount

## Lecture 89 - Setup Stripe

* signup to stripe
* default is test mode
* publishable key can be used in frontend
* secret-key only in backend
* we use stripe checkout
* we use stipe checkout react https://github.com/azmenak/react-stripe-checkout
* npm install --save react-stripe-checkout

## Lecture 90 - Stripe API Keys

* add publishable key and secret key in dev.js file and their reference to the prod.js file in config folder on the server side
* add the keys to the heroky app env variables
* any required file or imported is exposed to the outside world,
separate environments wisely
* when we import ES2015 modules we are not allowed to execute any logic before the import. so what we do in keys.js where we have an if statement before require cannot happen on client side.

## Lecture 92 - ENV Vars in React

* create react app has a solution (see: Adding Custom Environment Vars)
* we follow the docs and create a .env file for development(.env.development) and production in the client root folder
we add REACT_APP_STRIPE_KEY=pk_test_2mX9jD3jp43HoewOiZRl1KMV 
in both files. frontend client doesnt need the secret key.
* we access keys with process.env

## Lecture 93 - Payment Component

* we add a class based react componet for payments which renders the defualt export  (component) of react-strip-checkout
* we name our new react component Payments
* we add attributes to the stripe chekout comp
* we render it in header using React 16 array element(must be uniquely identified with key)
* stripe checkout token prop is the callback we pass to be called by stripe after 1st pahes of payment(check of card etc)
* we console log token for testing. it contains all data
* styling of button is terrible. we wrap StripeCheckout component around a button which we style ith materilaizecss class

## Lecture 96 - Reuse Action Types

* we reuse fetch_user action type to update user model where we pass in payload token data. we use it in our new action creator handleTOken
* we use connect from react-redux to connect actions to props passing the handler to the stripe checkout
* we create billing routes js in server routes folder
* we import billingroutes in server index.js file
* we add a stripe npm module for or backend. it uses the token sent by stripe and it exchanges with a charge to a credit card
* stripe has charge object for charging credit cards (check node api docs)
in stripe.charges.create the source atribute is the token we got from stripe
* we install it: npm install --save stripe at server side
* we add express route for posting to api/stripe in backend
* we import stripe in billingroutes.js. api says it needs secret key as argument
* we import keys,js from config
* we pass secret key const stripe = require('stripe')(keys.stripeSecretKey);
* we need to extract the token from the post header and use it in the charge. therefore we need body-parser
* we install it at server side and import it at index.js. bodyParser is an express middleware so we use it. app.use(bodyParser.json());

## Lecture 101 - Creating a charge object

* we call stripe.charges.create method passing the charge object in the post api/stripe route
* we use async/await to handle promise from stripe charge create

## Lecture 103 - Adding credit to user

* to keep track of credits we add another property to the user model
* we want to add an option to this property (initial value). so we pass all options as an object to the schema
* at route handler we increase the credit, persist it to the db and return the user back to the browser with response

## Lecture 105 - Require authentication

* no elegant solution: add if statement in post route
* elegant: add a custom express middleware and add it in the routes we want.
we add middlewares folder in server and asdd a file requireLogin
* in this file we export an anonymous function where we follow the middleware pattern. inside we put the check logedin logic.
* we can add middleware to express in general with app.use or in the express route handling functions  before the callback.

## Lecture 106 - Display Credit

* add an li to the Header to show credit

# Section 10 -Backend-Frontend Routing in Production

## Lecture 107 - Express with CreateReactApp in Production

* in production there is no createreactapp nor proxy. client side resides in public assets in backend express server and backend in node/express.api for api requests
* if i run npm run build in client is generated production assets
* it generates static js and css file bundles
the challenge is to make the production express app run the production generated public assets

* some routes are handled by react router and others by express. the assumption is to go first to react first (index.html)
* other routes try to access specific assets (js files)

## Lecture 108 - Routing in Production

* we run npm run build in client side to  see the production generated assets in client/build directory
* we add the following snipped in server side index.js file after express routes

// order of code is critical on what to look first and what next in production
// wrong order will create erroneous behaviour

if(process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file or main.css file
  app.use(express.static('client/build'));

  // Express will serve up the index.html file if it doesn't recognize the route. should always beplaced
  // after express routes
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

## Lecture 109 - Deployment Options

* we need to ensure that before we deploy to heroku we build our react app
* 3 options
** 1) build client project -> commit built project -> commit to heroku
** 2) push to heroku -> tell heroku to install all dependencies for client -> heroku builds project
** 3)  push to github or CI server  -> run tests -> github builds and commits client -> github pushes build to heroku
* we do not want to include our build to git

## Lecture 111 - Add heroku build step

* push to heroku -> heroku installs server deps -> heroku runs heroku-postbuid ->we tell heroku to install client deps -> we tell heroku to runnpm run build
* see heroku node.js support -> see customizing the build process
* we add    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client" in scripts in server package.json

# Section 10 - Surveys with Mongoose

## Lecture 114 - Server Routes

* get api/surveys "return list of surveys created by user"
* post api/surveys/webhooks "record feedback from a user"
* post api/surveys "create a new survey"
** title subject, body, recipients

## Lecture 114 - Survey Model

* we need a link between user model class and survey model class (1:n relation)
* we add a new survey schem in models folder
* we import it into index.js
* first draft of schema model has deficiencies (we set recipients a list of strings    recipients: [String]) 
* survey model has no provision for feedback
* we need to prevent duplicate votes
* add yes count , no count
* refactor reciptients to a list of ogjects with email string and voted flag
* subdocument collections has meaning where the subdocument has no meaning on its own without the owner
* user has references to the surveys he created. is not a subdocument collection as surveys have meaning on their own
* reference is more efficient
* collection document in mongodb has size limit of 4mb
* so a survey can have ~ 2000recipients
w* we create Recipient Schema and import it in Surveys where we setit as type for recipeints list
* add a user - survey reference relationship adding this to Survey schema
_user: { type: Schema.Types.ObjectId, ref: 'User' }

## Lecture 120 - Survey Creation Route handler

* add surveyRoutes.js file in server toutes folder and import it in apps index.js file
* add post route app.post('/api/surveys'
* add requireLogin middleware function in route
* check if user has credit. we do it with middleware lige requireLogin even though we use it in only one route. for scalability and flexibility
* we use body parsing to extract survey properties from req object with ES6 object destructuring.
* before saving values to db using mongoose we import the Survey model using mongoose model method and not by  importing the file from models folder. THis is done to facilitae testing !?!?!


## Lecture 123 - Create Recipients SubDoc Collections

* recipients: comma separated string from req body parsing => string split(',') => array of strings => string map() => array of objects with email => add it to survey model instance. => save it to db

## Lecture 125 - Create mailer

* create survey instance (done)
* create email template (tbd - htmp blob)
* add these to mailer (tbd - email generation helper)
* send mailer and email list to mail provider
* we want one send email request to email provider per survey not one rquest per recipient
* challenge is to distinguish recepient when they send feedback to survey
* we cannot put identifying token to email as all get same email
* we use send mail service provider cpabilites to solve this.
* we use sendgrid.com mail provider. when they see a link in the mail body they direct it to their server , collect metrics and then back to the actual destination (our backend). we use these metrics (who clicked). send grid sends a message to our backend telling us who clicked (via token??).we call this webhook.

## Lecture 127 - Sengrid Setup

* we signup for the free plan
* in the dashboard we go to settings -> api keys
* we create full acess key
* we add the key in congig files (dev and prod) and to heroku env variables
* we install npm library sendgrid to server side

## Lecture 128 - Mailer Setup

* Mailer will be an ES6 Class
* we populae properties from survey object, parse the class instanse object ot json and send it to sendgrid.
* we create Mailer.js file in services folder in server side
* we import sendgrid and ints child class mail which ew extend in Mailer.

## Lecture 129 - Mailer in use

* we assume Mailer is complete and we export it
* we import Mailer in surveyRoutes
* we create a mailer instance in post('/api/surveys after survey creation
* we pass as argument survey , we need the template as well which does not e xist yet
* we create a new folder in the service folder named emailTemplates
* we add a surveyTemplate.js file in the folder and we export an anonymous function which represents the template. this functions takes as argument the survey to populate its fields with survey body
* we import the surveytemplate in surveyroute in mailer instantiation passing survey as an argument.

## Lecture 130 - Mailer Constructor 

* typical ES2015 contstructor
* a lot of sendgrid specific code  (param settings)
* we use destructuring in constructor params to keep it general
* we use sendgrid helper functions and we define one of our own to pass recipient emails

## Lecture 131 - Boilerplate for sending emails

* we implement addClickTracking helper function in Mailer copying code from sendgrid docs
so that we can track users to avoid duplicate votes
* we implement addRecipients helper function in Mailer to use sendgrid helper utilities to add recipients to the mailer object
* we send our api key to sendgrid to use the service using sgApi
* we add a send function so that we can send mailer object to sendgrid, again we take APi methods to do this
* we invoce the method mailer.send() in surveyRoutes post route

## Lecture 134 - Testing email sending

* i  can test post api/surves route in postman but its difficult to authenticate and add credit in postman.
* we will test in the app by a direct call o the route through axios library
* we add the axios import and set to window in client side route source file index.js
import axios from 'axios';
window.axios = axios;
* now we go to the app homepage we launch dev tools and in console we can test by invoking axios methods
* after testing we remove axios from index.js
* we add html code to format our surveytemplate

## Lecture 136 - Polish the route handler

* mailer.send() is asynchronous so we put await in its call. also the parent function (post route) we make it async as well to use async/await pattern
* we save the survey
* we deduct a credit from user
* we save th user
* we return udated user to frontend
* we have a lot of awaits so we add error handling (try catch)

## Lecture 137 - verify sendgrid click tracking

* sendgrid nows who clicked. we can verify it inthe dashboard
* we need to pass absolute domain in the mail body for click link, as email is external to our app. we pass domain path as a env key in config
* we add a route in surveys to redirect users after clicking the links in our email. just plain text
