const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap = require("../util/asyncWrap");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/user");

//Go to signup page
router.get("/signup",userControllers.signupForm);

//SignUp to website
router.post("/signup",asyncWrap(userControllers.signUp));

//Go to login page
router.get("/login",userControllers.loginForm);

//Login to the website
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local',{
        failureRedirect: '/user/login',
        failureFlash: true 
    }), userControllers.login);

//Logout from the website
router.get("/logout",userControllers.logOut);

module.exports = router;