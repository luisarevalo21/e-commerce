const express = require("express");
const app = express();
const port = 8000;
const session = require("express-session");
const passport = require("passport");
require("./configs/GoogleConfig");
// require("./configs/LocalConfig");
const cors = require("cors");

const initializePassport = require("./passport-config");
initializePassport(passport);

// const initializeGooglePassport = require("./configs/GoogleConfig");
// initializeGooglePassport(passport);
// passportLocalInitialize(passport);

app.use(express.urlencoded({ extended: false }));

// app.use(flash());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 24 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

const productsRouter = require("./routes/products.js");
const localRouter = require("./routes/LocalRouter");
const cartRouter = require("./routes/cart.js");
const ordersRouter = require("./routes/orders");
const googleRouter = require("./routes/GoogleRouter");
const categoriesRouter = require("./routes/CategoriesRouter");

// app.use("/auth", googleRouter);
app.use("/accounts", localRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
// app.use("/orders", ordersRouter);

// app.get("/dashboard", (req, res) => {
//   // console.log("req,token", req.session.token);
//   console.log("dashboard triggered");
// });

//local get

app.get("/user-data", checkIsAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ loggedIn: true, user: req.user.email, id: req.user.id });
});

app.get("/dashboard", checkIsAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ loggedIn: true, user: req.user.email, id: req.user.id });
});
app.get("/nouser", (req, res) => {
  res.status(400).json({ loggedIn: false });
});
app.get("/login", (req, res) => {
  // console.log("rreq", req.user);
  // console.log("login triggered");
  res.status(404).json({ message: "Error user not found" });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

// app.post(
//   "/auth/google",
//   passport.authenticate(
//     "google",
//     { scope: ["email", "profile"] },
//     (req, res) => {
//       console.log("gogole login triggered");
//     }
//   )
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: true }),
//   (req, res) => {
//     res.redirect("/dashboard/=");
//   }
// );
// app.post(
//   "/auth/google",
//   passport.authenticate("google", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
//   }),
//   () => {
//     console.log("google auth is called");
//   }
// );

app.delete("/logout", (req, res) => {
  // console.log("logout triggered");

  req.logout(function (err) {
    if (err) return next(err);

    req.session = null;
    res.sendStatus(200);
    // res.redirect("/login");
  });
});

function checkIsAuthenticated(req, res, next) {
  // console.log("check authetnicated called", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/nouser");
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
