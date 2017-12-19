const passport =  require('passport');


module.exports = (app) => {
    // we use passport as a middleware. because we use google it will look for google strategy.
    // we pass some options specifying to google what access we want to have in the persons profile
    app.get('/auth/google/', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    
    // error Google reply
    // https://accounts.google.com/o/oauth2/v2/auth?
    //     response_type=code&
    //     redirect_uri=http%3A%2F%2Femaily-app-achliopa.c9users.io%2Fauth%2Fgoogle%2Fcallback&
    //     scope=profile%20email&
    //     client_id=1001208759067-7beqtg5hlrpgevgtnlv56usr13qjk77f.apps.googleusercontent.com
    
    // now when we send the user to passport and google (with the strategy) he will have the code 
    //google gave us with the redirection
    app.get('/auth/google/callback', 
        passport.authenticate('google'),
        (req,res) => {
            res.redirect('/surveys');
        });  

    app.get('/api/logout', (req,res) => {
         req.logout();
         res.redirect('/');
    });

    app.get('/api/current_user', (req,res) => {
        res.send(req.user);
    });
};