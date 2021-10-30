const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const Prescription = require("../models/prescription");

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.render('doctor/doctorDashboard', {
        name: req.user.name,
    })
})

router.get('/dashboard/patients', ensureAuthenticated, async (req, res) => {
    const owner = req.user._id
    let patients = await Patient.find({ owner })
    console.log(patients)
    res.render('doctor/patients', {
        patients
    })
})

router.get('/dashboard/patients/:id', ensureAuthenticated, async (req, res) => {
    const id = req.params.id
    res.render('doctor/prescriptions', {
        id
    })
})

router.get('/dashboard/patients/:patientId/prescribe', async (req, res) => {
    const id = req.params.patientId
    res.render('doctor/prescriptionForm', {
        id
    })
})


router.post("/savePrescription/:id", async (req, res) => {
    try {
        console.log("in prescription save ")
        console.log(req.body)
        const elements = typeOf(req.body.medicine);
        const { date, symptoms, medicine, dosage, description } = req.body;

        const medicines = []
        for (var i = 0; i < elements; i++) {
            var obj = {
                medicine: medicine[i],
                dosage: dosage[i],
                description: description[i]
            }
            medicines.push(obj)
        }

        const formdata = new Prescription({
            date, symptoms, medicines,
            owner: req.params.id
        })

        console.log(formdata)

        await formdata.save();
        res.status(201);
        res.render("doctor/doctorDashboard", {
            name: req.user.name
        });
    }
    catch (e) {
        res.status(400);
        console.log("Error: ", e);
    }
});
module.exports = router