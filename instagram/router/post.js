const express = require("express");
const router = express.Router();

//Post Index
router.get("/",(req,res)=>{
    res.send("All Posts are here");
});

//Post Show
router.get("/:id",(req,res)=>{
    res.send("Showing a perticular post");
})

//Post Add
router.get("/new",(req,res)=>{
    res.send("Form to add new post");
});
router.post("/",(req,res)=>{
    res.send("new post added");
});

//Post delete
router.delete("/:id",(req,res)=>{
    res.send("Post Deleted");
});

module.exports = router;