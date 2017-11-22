const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const ip = process.env.IP || undefined;
app.get('/', (req,res) => {
    res.send({bye: 'buddy'});
});

app.listen(port, ip, () => {
    console.log('server is running...');
})