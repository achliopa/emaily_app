// prod.js - production keys here!!

module.exports = {
    googleCLientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGO_URI,
    cookieKey: process.env.COOKIE_KEY,
    callbackURI: process.env.CALLBACK_URI
};