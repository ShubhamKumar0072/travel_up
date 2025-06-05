const express = require("express");
const router = express.Router();

//User Index
router.get("/",(req,res)=>{
    res.send("All Users are here");
});
//User Show
router.get("/:id",(req,res)=>{
    res.send("Showing a perticular user");
})
//User Add
router.get("/new",(req,res)=>{
    res.send("Form to add new user");
});
router.post("/",(req,res)=>{
    res.send("new user added");
});
//User delete
router.delete("/:id",(req,res)=>{
    res.send("User Deleted");
});

module.exports = router;