const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Prescription = require("../models/prescription");
const sendOtpEmail=require("../mailSender/mailSender");

const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get('/dashboard',ensureAuthenticated,async(req,res)=>
{
    res.render("pharmacist/dashboard",
    {
        user:req.user,
        errorMessage:""
    });
})

router.get('/wrongOTP',ensureAuthenticated,(req,res)=>{
    res.render("pharmacist/dashboard",
    {
        user:req.user,
        errorMessage:"You entered a wrong OTP, please retry."
    });
})

router.post('/verifyEmail',ensureAuthenticated,async(req,res)=>{
    var patient=await Patient.findOne({email:req.body.email});
    if(!patient)
    {
        res.render("pharmacist/dashboard",
        {
            user:req.user,
            errorMessage:"Please enter valid email"
        });
    }
    else
    {
        var otp=sendOtpEmail(req.body.email);
        console.log(otp);
        // console.log(patient);
        res.render("pharmacist/verifyotp",
        {
                user:req.user,
                otp,
                email,
                errorMessage:""
        });
        
    }
})

router.post('/showPatient/:email',ensureAuthenticated,async(req,res)=>{
    var email=req.params.email;
    var patient=await Patient.find({email});
    var prescription=await Prescription.findOne({owner:patient._id},{},{ sort: { 'created_at' : -1 } })
    console.log(prescription);
})


module.exports = router;