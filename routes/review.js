const express = require("express");
const router = express.Router( {mergeParams : true});
const asyncWrap = require("../util/asyncWrap");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const reviewController = require("../controllers/review");

//Adding a review
router.post("/",isLoggedIn, validateReview,asyncWrap(reviewController.addReview));

//Deleting a review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewController.deleteReview));

module.exports = router;