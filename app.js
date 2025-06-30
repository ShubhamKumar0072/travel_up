if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // to combile diff ejs files
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

app.engine('ejs', ejsMate);

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(flash());

//Setup MongoDB
const DBurl = process.env.ATLUSDB_URL;
main().then(()=>{
    console.log ("connected successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(DBurl);
}

//sessions setup
const store = MongoStore.create({
     mongoUrl: DBurl,
     crypto: {
        secret: process.env.SECRET,
     },
     touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("error in session store:",err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};
app.use(session(sessionOption));

//setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// //Root Rout
// app.get("/",(req,res)=>{
//     res.send("Home Page");
// });

//flash Massages (Info inside req.local to use it in every ejs file)
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//User Rout
const userRouter = require("./routes/user");
app.use("/user",userRouter);

//Listings Routes
const listingRouter = require("./routes/listing");
app.use("/listings",listingRouter);

//Reviews Routes
const reviewRouter = require("./routes/review");
app.use("/listings/:id/reviews",reviewRouter);


//Error handler middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"} = err;
    res.status(status).render("./listing/error.ejs",{status,message});
});








app.listen(8080,()=>{
    console.log("listning from port 8080");
})