const passport = require('passport');
const User = require('../models/UserSchema');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/V1/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const email = profile?.emails[0]?.value;
            const username = profile.displayName;
            const photo_url = profile?.photos[0]?.value;
            done(null, { email, username, photo_url });
        } catch (error) {
            console.log(error);
            done(error, null);
        }
    }
));

passport.serializeUser((userInfo, done) => {
    console.log(userInfo);
    done(null, userInfo);
});

passport.deserializeUser((id, done) => {
    console.log(id);
    done(null, id);
});

module.exports = passport