const authRouter = require("express").Router();
const passport = require("passport");
const db = require("../db/index.js");
const { passwordHash } = require("../db/hashing");

authRouter.get("/local/success", (req, res) => {
  res.sendStatus(200);
});
authRouter.get("/login/failed", (req, res) => {
  console.log("login failed error occured");
});
authRouter.post(
  "/login",
  passport.authenticate("local", {
    // failureRedirect: "/login/failed",
    // successRedirect: "/login/success",
    // failureMessage: true,
  }),
  (req, res) => {
    console.log("USER ID", req.user.id);
    // console.log(res);
    res.sendStatus(200);
  }
);

authRouter.post("/register", async (req, res, next) => {
  // console.log("req.body", req.body);
  const { email, password } = req.body;

  const hashedPassword = await passwordHash(password, 5);

  db.query(
    "SELECT email FROM accounts WHERE email = $1",
    [email],
    (err, result) => {
      if (err) return err;

      if (result.rows.length === 0) {
        db.query(
          "INSERT INTO accounts (email, password) VALUES($1, $2)",
          [email, hashedPassword],
          (err, result) => {
            if (err) return err;

            res.sendStatus(200);
          }
        );
      }
      if (result.rows.length > 0) {
        res.sendStatus(400);
      }
    }
  );
});

authRouter.get("/:userId", (req, res) => {
  const { userId } = req.params;

  db.query("SELECT * FROM accounts WHERE id = $1", [userId], (err, user) => {
    if (err) return err;

    if (user.rows.length === 0) {
      res.send("No user found");
    }

    res.render("accounts", { data: user.rows[0] });
    // res.status(201).send(user.rows[0]);
  });
});
// authRouter.post("/login", (req, res) => {});

module.exports = authRouter;
