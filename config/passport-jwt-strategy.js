const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;

// We are importing a module which will help us extractJWT from the header.
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey : 'secret'
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id, function(err, user) {
        if(err) {
            console.log('Error in finding user from JWT');
            return;
        }

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}));

module.exports = passport;