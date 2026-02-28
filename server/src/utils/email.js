const nodemailer = require("nodemailer");

function createTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER/SMTP_PASS not set in .env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
}

async function sendOtpEmail({ to, code }) {
  const transporter = createTransport();

  const subject = "Arys Bilim — Email Verification Code";
  const text = `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  });
}

module.exports = { sendOtpEmail };
