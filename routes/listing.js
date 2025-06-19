const express = require("express");
const router = express.Router();
const MyError = require("../util/myError");
const asyncWrap = require("../util/asyncWrap");
const Listing = require("../models/listing");
const {listingSchema} = require("../schema");

//To Show all listed hotels
router.get("/",asyncWrap(async(req,res,next)=>{
    const data = await Listing.find();
    res.render("./listing/index.ejs",{data});
}));

//Form of add listning
router.get("/new",(req,res)=>{
    res.render("./listing/newList.ejs");
});

//To add a new listing
router.post("/",asyncWrap(async(req,res,next)=>{
    let data = req.body;
    let result = listingSchema.validate({ listing: data });
    if(result.error){
        throw new MyError(400,result.error);
    }
    await Listing.insertOne(data);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//To show perticular listing
router.get("/:id",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you are tring to reach, no longer exists");
        res.redirect("/listings");
    }else{
        res.render("./listing/show.ejs",{listing});
    }
}));

//Form of edit listing
router.get("/:id/edit",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are tring to reach, no longer exists");
        res.redirect("/listings");
    }else{
        res.render("listing/edit.ejs",{listing});
    }
    
}));

//Edit the list in DB
router.put("/:id",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    req.flash("success","Listing Updated successfully");
    res.redirect(`/listings/${id}`);
}));

//Delete the list
router.delete("/:id",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;