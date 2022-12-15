const localRouter = require("express").Router();
const passport = require("passport");

const { passwordHash } = require("../db/hashing");
const db = require("../db/index");

// localRouter.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
//   }),
//   function (req, res) {
//     console.log(req.user);
//   }
// );

// localRouter.get("/dashboard", (req, res) => {
//   console.log("user is", req.user);
//   console.log("/ is triggered waht do i do here");
//   res.status(201).json("succesuflly logged in");
// });

// localRouter.get("/login", (req, res) => {
//   console.log("error occured when logging in");
//   // res.status(401).json("error logging in try again");
// });
// const db = require("../db/index.js");
// const { passwordHash, comparePasswords } = require("../db/hashing");
// const jwt = require("jsonwebtoken");
// const LocalStrategy = require("passport-local").Strategy;

// function initialize(passport) {
//   const authenticateUser = async (email, password, done) => {};

//   passport.use(new LocalStrategy(), authenticateUser);

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     return done(null, id);
//   });
// }

// module.exports = initialize;
// localRouter.get("/login/success", (req, res) => {
//   console.log("login in successfully triggeered");

//   // res.sendStatus(200);
// });
// localRouter.get("/login/failed", (req, res) => {
//   console.log("login failed error occured");
// });
// localRouter.post(
//   "/login",
//   passport.authenticate(
//     "local",
//     {
//       failureRedirect: "/login/failed",

//       // successRedirect: "/login/success",
//       // failureMessage: true,
//     },
//     async (req, res) => {
//       console.log("req", req.body);
//       const { email, password } = req.body;

//       const hashedPassword = await passwordHash(password, 5);
//       const token = jwt.sign(
//         {
//           exp: Math.floor(Date.now() / 1000) + 60 * 60,
//           data: { email, hashedPassword },
//         },
//         "secet-key"
//       );
//       req.token = token;

// db.query(
//   "SELECT id, email FROM account WHERE password = $1",
//   [hashedPassword],
//   (err, result) => {
//     if (err) return err;

//     if (result.rows[0]) {
//       res.status(201).json({ userId: result.rows[0].id, token });
//     }
//   }
// );

// console.log("Succsesfful login");
// }
//)

// console.log("USER ID", req.user.id);
// console.log(res);
// res.status(201).json({ id: req.user.id, });
// res.json(req.user);
//);

// localRouter.post("/login", async (req, res, next) => {
//   const { email, password } = req.body;
//   console.log(password);

//   console.log("Login");

//   const hashedPassword = await passwordHash(password);
//   const result = await comparePasswords(password, hashedPassword);
//   if (result) {
//     const token = jwt.sign(
//       {
//         exp: Math.floor(Date.now() / 1000) + 60 * 60,
//         data: { email, hashedPassword },
//       },
//       "secet-key"
//     );
//     // req.token = token;

//     db.query(
//       "SELECT id FROM accounts WHERE email = $1",
//       [email],
//       (err, result) => {
//         // console.log(err);
//         if (err) return err;

//         // console.log(result.rows);
//         if (result.rows[0]) {
//           return res.status(201).json({ userId: result.rows[0].id, token });
//         } else {
//           return res.status(400).json("user doesnt exits try against");
//         }
//       }
//     );
//   } else {
//     return res.status(400).json("password incorrect try again");
//   }
// });

localRouter.post("/register", async (req, res, next) => {
  // console.log("req.body", req.body);
  const { email, password } = req.body;

  const hashedPassword = await passwordHash(password, 10);
  // const token = jwt.sign(
  //   {
  //     exp: Math.floor(Date.now() / 1000) + 60 * 60,
  //     data: { email, hashedPassword },
  //   },
  //   "secet-key"
  // );
  // req.token = token;

  db.query(
    "SELECT email FROM accounts WHERE email = $1",
    [email],
    (err, result) => {
      if (err) return err;

      if (result.rows.length === 0) {
        db.query(
          "INSERT INTO accounts (email, password) VALUES($1, $2) RETURNING id",
          [email, hashedPassword],
          (err, result) => {
            if (err) return err;
            console.log("result ", result);

            // console.log(err);
            db.query(
              "INSERT INTO cart (account_id) VALUES($1)",
              [result.rows[0].id],
              (err, userId) => {
                if (err) return err;
                res.status(201).json({ userId: result.rows[0].id });
                // res.json(tokens, userId);
              }
            );
          }
        );
      }

      //if user exists
      if (result.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "User exists try signing in instead" });
      }
    }
  );
});

// // localRouter.get("/:userId", (req, res) => {
// //   const { userId } = req.params;

// //   db.query("SELECT * FROM accounts WHERE id = $1", [userId], (err, user) => {
// //     if (err) return err;

// //     if (user.rows.length === 0) {
// //       res.send("No user found");
// //     }

// //     res.render("accounts", { data: user.rows[0] });
// //     // res.status(201).send(user.rows[0]);
// //   });
// // });
// // authRouter.post("/login", (req, res) => {});

module.exports = localRouter;
