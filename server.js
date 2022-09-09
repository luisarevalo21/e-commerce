const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./db/index");
const session = require("express-session");
const { comparePasswords } = require("./db/hashing");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");

const productsRouter = require("./routes/products.js");
const accountsRouter = require("./routes/accounts.js");
const authRouter = require("./routes/auth");

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log("USER IN SERALIZE", user);

  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query(`SELECT * FROM accounts WHERE id = ${id}`, function (err, result) {
    if (err) return done(err);

    done(null, result);
  });
});
passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    username,
    password,
    done
  ) {
    db.query(
      `SELECT * FROM accounts WHERE email = '${username}'`,
      null,
      async (err, user) => {
        if (err) return err;
        if (!user.rows[0]) {
          return done(null, false);
        }

        const hashedPassword = user.rows[0].password;
        const passwordsMatched = await comparePasswords(
          password,
          hashedPassword
        );

        if (passwordsMatched) {
          return done(null, user.rows[0]);
        }
      }
    );
    // console.log("password", password);
    // console.log("hased passowrd", hashedPassword);
    // const result = await comparePasswords(password, hashedPassword);
    // console.log("FINAL RESULT IS", result);
    //check here for password and hashed passwords are correct
    //req.body should have the password entered
    //or req.user will have it
    // console.log("HASHED PASSWORD", hashedPassword);
    // const result = comparePasswords(password, hashedPassword);
    // console.log("RESULT", result);
    // db.query(
    //   `SELECT * FROM accounts WHERE email = '${username}' AND password = '${password}'`,
    //   null,
    //   (err, user) => {
    //     console.log("USER", user);
    //     if (err) return done(err);
    //     if (!user.rows[0]) {
    //       return done(null, false);
    //     }
    //     if (user.rows[0].password !== password) {
    //       return done(null, false);
    //     }
    //     return done(null, user.rows[0]);
    //   }
    // );
  })
);

// passport.use(
//   new LocalStrategy(function verify(username, password, cb) {
//     db.get(
//       "SELECT * FROM users WHERE username = ?",
//       [username],
//       function (err, row) {
//         if (err) {
//           return cb(err);
//         }
//         if (!row) {
//           return cb(null, false, {
//             message: "Incorrect username or password.",
//           });
//         }

//         crypto.pbkdf2(
//           password,
//           row.salt,
//           310000,
//     32,
//     "sha256",
//     function (err, hashedPassword) {
//       if (err) {
//         return cb(err);
//       }
//       if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//         return cb(null, false, {
//           message: "Incorrect username or password.",
//         });
//       }
//       return cb(null, row);
//     }
//   );
// }
//     );
//   })
// );

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/products", productsRouter);
app.use("/accounts", accountsRouter);
app.use("/login", authRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("USER ID", req.user.id);
    res.redirect(`/accounts/${req.user.id}`);
  }
);

app.get("/account", (req, res) => {
  res.send("HELLPO FROM ACCOUNT");
});
app.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);

    res.redirect("/login");
  });
});

// app.get("/products", (req, res) => {
//   db.query("SELECT * FROM products", null, (err, result) => {
//     if (err) return err;
//     res.status(200).send(result.rows);
//   });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
