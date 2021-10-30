const mongoose = require("mongoose");

const pharmacistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role:
    {
        type:String,
        required:true
    },
    age:
    {
        type:Number,
        required:true
    },
    phoneNumber:
    {
        type:Number,
        required:true
    },
    gender:
    {
        type:String,
        required:true
    }
},{timestamps:true});

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);

module.exports = Pharmacist;
