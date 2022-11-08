const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db/index.js");
require("dotenv").config();

// console.log("google client id", process.env.GOOGLE_CLIENT_ID);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      //save into db
      const user = {
        username: profile.displayName,
        email: profile.emails[0].value,
        id: profile.id,
      };
      // console.log("profile", profile);

      db.query(
        "SELECT email FROM accounts WHERE email = $1",
        [user.email],
        function (err, result) {
          // console.log(err);
          if (err) {
            console.log("error came from google config err");
            return err;
          }
          // console.log(cred);
          if (result.rows.length === 0) {
            console.log("insierting into db");
            db.query(
              "INSERT INTO accounts (email, password) VALUES ($1, $2)",
              [user.email, user.id],
              (err, result) => {
                // console.log("err", err);
                if (err) return err;

                return cb(null, user);
              }
            );
          }
          //user exsits
          if (result.rows.length > 0) {
            return cb(null, user);
          }
        }
      );
      // db.query(
      //   "SELECT email FROM accounts WHERE email = ?",
      //   [profile.id],
      //   function (err, cred) {
      //     if (err) return err;

      //     if (!cred) {
      //       // insert into accounts array
      //     }
      //   }
      // );
    }
  )
);

//configure the serealize lise

passport.serializeUser((user, done) => {
  // console.log("USER IN google serialize", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);

  //   db.query(`SELECT * FROM accounts WHERE id = ${id}`, function (err, user) {
  //     if (err) return done(err);

  //     // console.log("RESULT", user);
  //     done(null, user.rows[0].id);
  //   });
});
