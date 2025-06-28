const User = require("../models/user");

module.exports.signupForm = (req,res)=>{
    res.render("./users/newUser.ejs");
};

module.exports.signUp = async(req,res)=>{
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
};

module.exports.loginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome back to TravelUp!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out");
        res.redirect("/listings");
    });
};