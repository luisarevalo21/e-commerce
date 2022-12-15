const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db/index.js");
require("dotenv").config();

// console.log("google client id", process.env.GOOGLE_CLIENT_ID);

const initalizeGoogle = passport => {
  const authUser = () => {
    console.log("auth user called");
  };
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      authUser
    )
    // function (accessToken, refreshToken, profile, cb) {
    //   //save into db
    //   const user = {
    //     username: profile.displayName,
    //     email: profile.emails[0].value,
    //     id: profile.id,
    //   };
    // }
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    return done(null, id);
  });
};
// console.log("google login is triggered");

// db.query(
//   "SELECT email FROM accounts WHERE email = $1",
//   [user.email],
//   function (err, result) {
//     // console.log(err);
//     if (err) {
//       console.log("error came from google config err");
//       return err;
//     }
//     // console.log(cred);
//     if (result.rows.length === 0) {
//       console.log("insierting into db");
//       db.query(
//         "INSERT INTO accounts (email, password) VALUES ($1, $2)",
//         [user.email, user.id],
//         (err, result) => {
//           // console.log("err", err);
//           if (err) return err;

//     return cb(null, user);
//   }
// );
// }
//user exsits
// if (result.rows.length > 0) {
//   console.log("the user exists im inside ehre ");
//   return cb(null, user);
// }
// }
// );
// }

//configure the serealize lise

module.exports = initalizeGoogle;
