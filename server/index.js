const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
// const authRoutes = require('./routes/authRoutes');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();
const port = process.env.PORT || 5000;
const ip = process.env.IP || undefined;


// authRoutes(app);
require('./routes/authRoutes')(app);




app.listen(port, ip, () => {
    console.log('server is running...');
})