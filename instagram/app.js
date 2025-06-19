const express = require("express");
const app = express();
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const flash = require("connect-flash");
app.use(flash());


const session = require("express-session");

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized:true
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser("secretcode"));


app.get("/register",(req,res)=>{
    let {name = "TempName"} = req.query;
    req.session.name = name;
    req.flash("info","Registered Sucssefully");
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.locals.msg = req.flash("info");
    res.render("hellow.ejs",{name: req.session.name});
});

const users = require("./router/user");
app.use("/users",users);

const post = require("./router/post");
app.use("/posts",post);





//Root Rout
app.get("/",(req,res)=>{
    res.send("Root is Working");
});

app.listen(3000,()=>{
    console.log("listining from port 3000");
});
























// //Cookee
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("sent you some cookies!");
// });

// //Signed Cookie
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("colour","red",{signed:true});
//     res.send("done!");
// });

// //verify
// app.get("/verify",(req,res)=>{
//     console.dir(req.signedCookies)
//     res.send("verifivation done");
// })

// //Get cookie
// app.get("/myCookies",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Parse success");
// });