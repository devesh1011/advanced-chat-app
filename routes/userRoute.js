const express = require("express");
const router = express.Router();
const {
  register,
  registerForm,
  loginForm,
  login,
  logout,
  getProfile,saveChat
} = require("../controllers/userController");
const upload = require("../config/multerConfig");
const passport = require("passport");
const { isAuth } = require("../middleware/isAuth.js");

router
  .get("/register", registerForm)
  .get("/login", loginForm)
  .get("/profile", isAuth, getProfile)
  .get("/logout", isAuth, logout)
  .post("/register", upload.single("image"), register)
  .post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/users/login-failure",
      successRedirect: "/users/profile",
    }),
    login
  )
  .get("/login-failure", (req, res, next) => {
    res.send("You entered the wrong password.");
  })
  .get("/login-success", (req, res, next) => {
    const html =
      "<p>You have successfully logged in. <a href='/users/profile'>Go to protected Route</a></p>";

    res.send(html);
  })
  .post("/save-chat", saveChat);

module.exports = router;
