const express = require("express");
const app = express();

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