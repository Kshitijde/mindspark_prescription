const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    expertise: {
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
});

doctorSchema.virtual("patients", {
    ref: "Patient",
    localField: "_id",
    foreignField: "owner",
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;