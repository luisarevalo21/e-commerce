const express = require("express");
const db = require("../db/index.js");
const { passwordHash } = require("../db/hashing");
const accountsRouter = express.Router();

//,maybe move them later?
// accountsRouter.get("/signup", (req, res) => {
//   res.render("signup");
// });
accountsRouter.post("/register", async (req, res, next) => {
  //come back to prevent same email from being adde to database
  //https://github.com/Aminadav/passport-one-session-per-user
  //https://stackoverflow.com/questions/29144827/express-js-passport-js-how-to-restrict-multiple-login-by-the-same-user

  const { email, password } = req.body;

  const hashedPassword = await passwordHash(password, 5);

  db.query(
    `INSERT INTO accounts (email, password) VALUES('${email}', '${hashedPassword}')`,
    null,
    (err, result) => {
      console.log("ERR", err);
      if (err) {
        res.redirect("/signup");
      }

      //gives me the id
      console.log("result", result.rows[0].id);
      const user = {
        id: result.rows[0].id,
      };
      req.login(user, err => {
        if (err) return err;
        res.redirect(`/accounts/${user.id}`);
      });
    }
  );
});

accountsRouter.get("/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    `SELECT * FROM accounts WHERE id = '${userId}'`,
    null,
    (err, user) => {
      if (err) return err;

      if (user.rows.length === 0) {
        res.send("No user found");
      }

      res.render("accounts", { data: user.rows[0] });
      // res.status(201).send(user.rows[0]);
    }
  );
});

// accountsRouter.delete("/delete", (req, res) => {
//   const currentUser = req.user.id;

//   console.loog("got a delete request", req.user.id);

// });

// accountsRouter.post("/login", (req, res) => {});

module.exports = accountsRouter;
