const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const session = require("express-session");
const passport = require("passport");
require("./configs/GoogleConfig");
require("./configs/LocalConfig");
const cors = require("cors");

const productsRouter = require("./routes/products.js");
const authRouter = require("./routes/LocalRoute");
const cartRouter = require("./routes/cart.js");
const ordersRouter = require("./routes/orders");
const googleRouter = require("./routes/GoogleRoute");

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 100,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, DELETE, PUT",
    credentials: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/products", productsRouter);
app.use("/accounts", authRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/auth", googleRouter);

app.get("/dashboard", () => {
  console.log("dashboard triggered");
});

app.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);

    res.redirect("/login");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.get("/products", (req, res) => {
//   db.query("SELECT * FROM products", null, (err, result) => {
//     if (err) return err;
//     res.status(200).send(result.rows);
//   });
// });
