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



app.listen(port, ip, () => {
    console.log('server is running...');
})