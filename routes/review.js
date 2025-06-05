const express = require("express");
const router = express.Router( {mergeParams : true});
const MyError = require("../util/myError");
const asyncWrap = require("../util/asyncWrap");
const {reviewSchema} = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");



//Error of reviews by JOI
const validateReview = (req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new MyError(400,errMsg);
    }else{
        next();
    }
}

//Adding a review
router.post("/",validateReview,asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

//Deleting a review
router.delete("/:reviewId",asyncWrap( async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;