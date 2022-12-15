const googleRouter = require("express").Router();
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
const { passwordHash } = require("../db/hashing");

const db = require("../db/index");
// const passport = require("passport");

// googleRouter.get("/login/success", (req, res, next) => {
//   if (req.user) {
//     res.status(200).json({
//       success: true,
//       message: "successful!",
//       user: req.user,
//       cookie: req.cookies,
//     });
//   }
// });
// googleRouter.get("/login/failed", (req, res, next) => {
//   res.status(401).json({
//     success: false,
//     message: "error",
//   });
// });

// googleRouter.get(
//   "/google",
//   // passport.authenticate("google", { scope: ["profile", "email"] })
// );

// googleRouter.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/dashboard",
//     failureRedirect: "/login/failed",
//   })
// );

googleRouter.post("/google", async (req, res) => {
  console.log("inside post", req.body.code);

  // const { token } = req.body;
  // console.log(req.body);
  // oAuth2Client.

  const { tokens } = await oAuth2Client.getToken(req.body.code);

  if (tokens) {
    // get user data and store into database

    const userData = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, sub, name, picture } = userData.getPayload();
    const hashedPassword = await passwordHash(sub, 5);

    db.query(
      "SELECT email FROM accounts WHERE email = $1",
      [email],
      function (err, result) {
        if (err) {
          console.log("error came from google config err");
          return err;
        }
        // console.log("result", result);

        if (result.rows.length === 0) {
          console.log("insierting into db");
          db.query(
            "INSERT INTO accounts (email, password) VALUES ($1, $2) RETURNING id",
            [email, hashedPassword],
            (err, result) => {
              // console.log("err", err);
              if (err) return err;

              db.query(
                "INSERT INTO cart (account_id) VALUES($1)",
                [result.rows[0].id],
                (err, userId) => {
                  if (err) return err;

                  req.user = {
                    email: result.rows[0].email,
                    id: result.rows[0].id,
                  };

                  res
                    .status(200)
                    .json({ ...tokens, userId: result.rows[0].id });
                  // res.json(tokens, userId);
                }
              );
              // res.status(201);
              // res.json({ name, email, picture });
            }
          );
        }
        if (result.rows.length > 0) {
          //check if token isnt expired
          db.query(
            "SELECT id FROM accounts WHERE email = $1",
            [email],
            (err, result) => {
              if (err) return err;

              res.status(201);

              const response = { ...tokens, userId: result.rows[0].id };

              res.json(response);
            }
          );

          // res.json({ email, sub, name, picture });
        }
      }
    );
  }
});
// const { token } = req.body;

// const result = await oAuth2Client.verifyIdToken({
//   idToken: token,
//   audience: process.env.GOOGLE_CLIENT_ID,
// });
// const { email, sub, name, picture } = result.getPayload();
// const hashedPassword = passwordHash(sub, 5);

// db.query(
//   "SELECT email FROM accounts WHERE email = $1",
//   [email],
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
//         [email, hashedPassword],
//         (err, result) => {
//           // console.log("err", err);
//           if (err) return err;
//           res.status(201);
//           res.json({ name, email, picture });
//         }
//       );
//     }
//user exsits
// if (result.rows.length > 0) {
//   //check if token isnt expired
//   res.status(201);
//   res.json({ name, email, picture });
// }
// }
// );

googleRouter.post("/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

googleRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = googleRouter;
