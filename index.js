const express = require('express');
const passport =  require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 5000;
const ip = process.env.IP || undefined;


//passport.use(new GoogleStrategy());

app.listen(port, ip, () => {
    console.log('server is running...');
})