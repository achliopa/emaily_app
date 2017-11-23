const express = require('express');
require('./services/passport');
// const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;
const ip = process.env.IP || undefined;


// authRoutes(app);
require('./routes/authRoutes')(app);




app.listen(port, ip, () => {
    console.log('server is running...');
})