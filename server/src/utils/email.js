const sgMail = require("@sendgrid/mail");

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is missing");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL;

if (!FROM_EMAIL) {
  throw new Error("FROM_EMAIL is missing");
}

const sendVerificationCodeEmail = async (toEmail, code) => {
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: "Arys-BIL Verification Code",
    text: `Your verification code: ${code}\nThis code expires in 10 minutes.`,
  });
};

module.exports = { sendVerificationCodeEmail };
