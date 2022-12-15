// const localRouter = require("express").Router();
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/index.js");

const { passwordHash, comparePasswords } = require("./db/hashing");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    // const user = getUserData(email);

    console.log("authenitcate user is called");

    try {
      db.query(
        "SELECT email, id, password FROM accounts WHERE email = $1",
        [email],
        async (err, result) => {
          if (err) return err;

          if (result.rows.length === 0) {
            console.log("inside error");
            return done(null, false);
          }
          const user = result.rows[0];
          // console.log("conitinuing");
          if (await comparePasswords(password, user.password)) {
            return done(null, user);
          }
        }
      );
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    return done(null, id);
  });
}

module.exports = initialize;

// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcrypt");

// function initialize(passport, getUserByEmail, getUserById) {
//   const authenticateUser = async (email, password, done) => {
//     const user = getUserByEmail(email);

//     if (user == null) {
//       return done(null, false, { message: "No user with that email" });
//     }

//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Password incorrect" });
//       }
//     } catch (err) {
//       return done(err);
//     }
//   };
//   passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

//   passport.serializeUser((user, done) => {
//     console.log("user", user);
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     console.log("id", id);

//     console.log(getUserById(id));
//     done(null, getUserById(id));
//   });
// }

// module.exports = initialize;
