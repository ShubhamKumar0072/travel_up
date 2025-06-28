const Listing = require("../models/listing");
const {listingSchema} = require("../schema");
const MyError = require("../util/myError");

module.exports.index = async(req,res,next)=>{
    const data = await Listing.find();
    res.render("./listing/index.ejs",{data});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listing/newList.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    let data = req.body;
    let result = listingSchema.validate({ listing: data });
    if(result.error){
        throw new MyError(400,result.error);
    }
    data.owner = req.user._id;
    await Listing.insertOne(data);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.showListing = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews",populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you are tring to reach, no longer exists");
        res.redirect("/listings");
    }else{
        res.render("./listing/show.ejs",{listing});
    }
}

module.exports.renderEditForm = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are tring to reach, no longer exists");
        res.redirect("/listings");
    }else{
        res.render("listing/edit.ejs",{listing});
    }
    
}

module.exports.editListing = async(req,res,next)=>{
    let {id} = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    req.flash("success","Listing Updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};