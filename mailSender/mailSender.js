var nodemailer = require("nodemailer");
var random = require("random");
// var hbs = require('nodemailer-express-handlebars')
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "teamswiftprescribe@gmail.com",
    pass: "swiftprescribe",
  },
});


const sendOtpEmail = (email) => {
  const otp = random.int((min = 1001), (max = 9999));

  var otpMailOptions = {
    from: "teamswiftprescribe@gmail.com",
    to: email,
    subject: "OTP from Quick Prescribe",
    // text: `The following is your otp ${otp} `,
    html: `
    <div style="padding:50px;border:1px solid black">      
        <div><h2>Dear user,<br>As per your request, OTP for password reset is -  ${otp}</h2></div>
        <h4>Please Do Not share it with anyone</h4>
    
    </div>`,
  };

  transporter.sendMail(otpMailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return otp;
};

module.exports = sendOtpEmail;