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

router.get('/dashboard/patients/:patientId/history', async (req, res) => {
    const id = req.params.patientId
    var prescriptions = await Prescription.find({ owner: id }, { date: 1, _id: 1, symptoms: 1 })
    console.log(prescriptions)
    res.render('doctor/prescriptions', {
        prescriptions,
        user: req.user
    })
})

router.get('/dashboard/patients/:patientId/history/:prescriptionId/view', async (req, res) => {
    const id = req.params.prescriptionId
    console.log('VIEW')
    const prescription = await Prescription.findOne({ _id: id })
    console.log(prescription)
    res.render('doctor/prescriptionView', {
        prescription,
        user: req.user
    })
})

router.get('/dashboard/patients/:patientId/history/:prescriptionId/edit', async (req, res) => {
    const id = req.params.patientId
    const prescription = await Prescription.findOne({ _id: id })
    console.log(prescription)
    res.render('doctor/prescriptionEdit', {
        id,
        prescription,
        user: req.user
    })
})


router.post("/savePrescription/:id", ensureAuthenticated, async (req, res) => {
    try {
        console.log("in prescription save ")
        console.log(req.body)
        const { date, symptoms, medicine, dosage, description } = req.body;
        var medicines = []
        if (typeof medicine == 'string') {

            var obj = {
                medicine,
                dosage,
                description
            }
            medicines.push(obj)
        }
        else {
            const elements = req.body.medicine.length;
            for (var i = 0; i < elements; i++) {
                var obj = {
                    medicine: medicine[i],
                    dosage: dosage[i],
                    description: description[i]
                }
                medicines.push(obj)
            }
        }

        const formdata = new Prescription({
            date, symptoms, medicines,
            owner: req.params.id
        })

        console.log(formdata)

        await formdata.save();
        res.status(201);
        res.redirect("/doctor/dashboard")
    }
    catch (e) {
        res.status(400);
        console.log("Error: ", e);
    }
});

router.get('/dashboard/profile', ensureAuthenticated, async (req, res) => {
    console.log("In doctor profile")
    var doctor = await Doctor.findOne({ email: req.user.email })
    console.log(doctor);
    res.render("doctor/profile",
        {
            doctor
        })
})


module.exports = router