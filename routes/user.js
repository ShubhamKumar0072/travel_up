const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap = require("../util/asyncWrap");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

//Go to signup page
router.get("/signup",(req,res)=>{
    res.render("./users/newUser.ejs");
});

//SignUp to website
router.post("/signup",asyncWrap(async(req,res)=>{
    try{
     let {username ,email, password} = req.body;
        const newUser = new User({email,username});
        const regUser = await User.register(newUser, password);
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to TravelUp");
            res.redirect("/listings");
        })

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
}));

//Go to login page
router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

//Login to the website
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local',{
        failureRedirect: '/user/login',
        failureFlash: true 
    }), 
    async(req,res)=>{
        req.flash("success","Welcome back to TravelUp!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
});

//Logout from the website
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out");
        res.redirect("/listings");
    });
});

module.exports = router;