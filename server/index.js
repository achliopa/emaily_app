const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
// const authRoutes = require('./routes/authRoutes');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5000;
const ip = process.env.IP || 'localhost';


// authRoutes(app);
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

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



app.listen(port, ip, () => {
    console.log('server is running...');
})