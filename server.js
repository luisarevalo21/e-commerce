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
const cartRouter = require("./routes/cart.js");
const ordersRouter = require("./routes/orders");

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
  // console.log("USER IN SERALIZE", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query(`SELECT * FROM accounts WHERE id = ${id}`, function (err, user) {
    if (err) return done(err);

    // console.log("RESULT", user);
    done(null, user.rows[0].id);
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
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/products", productsRouter);
app.use("/accounts", accountsRouter);
app.use("/login", authRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
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
