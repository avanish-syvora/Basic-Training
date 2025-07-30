import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import User from "../models/user.js";
import { where } from "sequelize";

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {

    try {
        let user = await User.findOne({ where: { googleId: profile.id } });
    
        if (!user) {
        user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            // Generate username from email if needed
            username: profile.emails[0].value.split('@')[0],
            role: 'user'
        });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


export default passport;