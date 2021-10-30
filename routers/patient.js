const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Prescription = require("../models/prescription");

const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get('/prescriptions', ensureAuthenticated, async (req, res) => {
    console.log("IN patient prescriptions")
    var prescriptions = await Prescription.find({ owner: req.user._id }, { date: 1, _id: 1, medicines: 1 })
    console.log(prescriptions);
    res.render("patient/prescriptions",
        {
            prescriptions,
            user: req.user
        })
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.render("patient/dashboard",
        {
            user: req.user
        });
})

router.get('/profile', ensureAuthenticated, async (req, res) => {
    console.log("IN patient profile")
    var patient = await Patient.find({ email: req.user.email })
    console.log(patient);
    res.render("patient/profile",
        {
            patient,
            user: req.user
        })
})

router.get('/showPrescription/:id',ensureAuthenticated,async(req,res)=>{
    var prescription=await Prescription.findOne({_id:req.params.id})
    console.log(prescription);
    res.render('patient/prescriptionView',{
        prescription,
        user: req.user
    })
       
})
module.exports = router;