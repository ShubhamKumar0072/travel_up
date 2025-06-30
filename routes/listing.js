const express = require("express");
const router = express.Router();
const MyError = require("../util/myError");
const asyncWrap = require("../util/asyncWrap");
const Listing = require("../models/listing");
const {listingSchema} = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listing");

const multer  = require('multer');
const {storage} = require("../coudConfig");
const upload = multer({storage});


//To Show all listed hotels
router.get("/",asyncWrap(listingController.index));

//Form of add listning
router.get("/new",isLoggedIn,listingController.renderNewForm);

//To add a new listing
router.post("/",isLoggedIn,upload.single('image'),asyncWrap(listingController.createListing));

//To show perticular listing
router.get("/:id",asyncWrap(listingController.showListing));

//Form of edit listing
router.get("/:id/edit",isLoggedIn,isOwner, asyncWrap(listingController.renderEditForm));

//Edit the list in DB
router.put("/:id",isLoggedIn, isOwner, upload.single('image'), asyncWrap(listingController.editListing));

//Delete the list
router.delete("/:id",isLoggedIn,isOwner, asyncWrap(listingController.deleteListing));

module.exports = router;