const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
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

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
