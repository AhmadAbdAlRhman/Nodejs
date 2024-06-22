const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmadhajnajeeb45@gmial.com",
    pass: "jrkcwpruadulaccw",
  },
});

module.exports.sendEmail = (to , subject , text) =>{
    const mailOptions = {from:"ahmadhajnajeeb45@gmail.com",
        to,
        subject,
        text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
