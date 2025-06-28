const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main().then(()=>{
    console.log ("connected successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travel_up');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj,owner: "685521d8a50f99ebaa79650b"}));
    await Listing.insertMany(initData.data);
    console.log("Data successfully initialized");
}



initDB();