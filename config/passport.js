const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
}, (accessToken, refreshToken, profile, cb) => {
    User.findOne({ 'googleId': profile.id }, function(err, student) {
        if (err) return cb(err);
        if (user) {
         return cb(null, user);
        } else {
         // we have a new user via OAuth!
            const newUser = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id
            });
            newUser.save(function(err) {
                if (err) return cb(err);
                return cb(null, newUser);
            });
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user);
    });
});