const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    role: {
        type: String,
        required: true,
    },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;