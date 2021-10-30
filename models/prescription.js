const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    medicines: [
        {
            medicine: String,
            dosage: String,
            description: String
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },
},{timestamps:true});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
