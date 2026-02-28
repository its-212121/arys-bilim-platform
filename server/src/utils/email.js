const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationCodeEmail = async (toEmail, code) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: "Arys-BIL Verification Code",
    text: `Your verification code: ${code}\nThis code expires in 10 minutes.`,
  });
};

module.exports = { sendVerificationCodeEmail };
