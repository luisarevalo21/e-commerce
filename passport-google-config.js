const GoogleStrategy = require("passport-google-oauth2").Strategy;
const db = require("./db/index.js");

const googleInitialize = passport => {
  const authUser = () => {};

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/callback",
        passReqToCallback: true,
      },
      authUser
    )
  );

  passport.serializeUser((user, done) => {
    done(user.id);
  });

  passport.deserializeUser((id, done) => {
    return done(null, id);
  });

  // passport.deserializeUser( (user done)=>{})
};

module.exports = googleInitialize;
