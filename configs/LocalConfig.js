const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../db/index.js");
const { comparePasswords } = require("../db/hashing");
require("dotenv").config();

passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    username,
    password,
    done
  ) {
    // console.log("lcoal triggered");
    db.query(
      "SELECT * FROM accounts WHERE email = $1",
      [username],
      async function (err, user) {
        // console.log("err", err);
        if (err) return err;
        if (!user.rows[0]) {
          return done(null, false);
        }
        const hashedPassword = user.rows[0].password;
        const passwordsMatched = await comparePasswords(
          password,
          hashedPassword
        );

        if (!passwordsMatched) {
          return done(null, false);
        }
        if (passwordsMatched) {
          return done(null, user.rows[0]);
        }

        // if(result.rows.length ===0){
        //     db.query("INSERT INTO accounts (email, password) VALUES ($1, $2)", [username])
        // }
      }
    );
  })
);

passport.serializeUser((user, done) => {
  //   console.log("USER IN SERALIZE", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query(`SELECT * FROM accounts WHERE id = ${id}`, function (err, user) {
    if (err) return done(err);

    // console.log("RESULT", user);
    done(null, user.rows[0].id);
  });
});
