const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    medicines: [
        {
            medName: String,
            dosage: String
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;