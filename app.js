const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // to combile diff ejs files
const session = require("express-session");
const flash = require("connect-flash");


app.engine('ejs', ejsMate);

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(flash());

const sessionOption = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};
app.use(session(sessionOption));

//Setup MongoDB
main().then(()=>{
    console.log ("connected successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travel_up');
}



//Root Rout
app.get("/",(req,res)=>{
    res.send("Home Page");
});

//flash Massages
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Listings Routes
const listing = require("./routes/listing");
app.use("/listings",listing);

//Reviews Routes
const review = require("./routes/review");
app.use("/listings/:id/reviews",review);


//Error handler middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"} = err;
    res.status(status).render("./listing/error.ejs",{status,message});
});








app.listen(8080,()=>{
    console.log("listning from port 8080");
})