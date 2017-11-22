const express = require('express');
const passport =  require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 5000;
const ip = process.env.IP || undefined;

// client ID: 465024689602-5f782cs2sn10o9130f5le4f5i0rlbbun.apps.googleusercontent.com
// secret: 8I9lpUTyfgPU6i1Y4ywbI_Yz
//passport.use(new GoogleStrategy());

app.listen(port, ip, () => {
    console.log('server is running...');
})