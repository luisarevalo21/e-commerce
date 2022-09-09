const express = require("express");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.render("login");
});

authRouter.get("/account", (req, res) => {
  res.send("hello from acount");
});
module.exports = authRouter;
