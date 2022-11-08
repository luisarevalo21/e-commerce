const googleRouter = require("express").Router();
const passport = require("passport");

googleRouter.get("/login/success", (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful!",
      user: req.user,
      cookie: req.cookies,
    });
  }
});
googleRouter.get("/login/failed", (req, res, next) => {
  res.status(401).json({
    success: false,
    message: "error",
  });
});

googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "/login/failed",
  })
);

googleRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = googleRouter;
