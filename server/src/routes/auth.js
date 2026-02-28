const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../utils/email");
const { signToken } = require("../utils/token");

const router = express.Router();

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) return res.status(400).json({ message: "Missing fields" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      fullName: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: "student",
      isEmailVerified: false
    });

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    await Otp.deleteMany({ email: user.email });
    await Otp.create({ email: user.email, codeHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    await sendOtpEmail({ to: user.email, code });

    return res.status(201).json({ message: "Registered. Check email for OTP.", userId: user._id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ message: "Missing fields" });

    const otp = await Otp.findOne({ email: String(email).toLowerCase().trim() });
    if (!otp) return res.status(400).json({ message: "OTP not found or expired" });
    if (otp.expiresAt.getTime() < Date.now()) {
      await Otp.deleteOne({ _id: otp._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const ok = await bcrypt.compare(String(code), otp.codeHash);
    if (!ok) return res.status(400).json({ message: "Invalid code" });

    await User.updateOne({ email: otp.email }, { $set: { isEmailVerified: true } });
    await Otp.deleteOne({ _id: otp._id });

    return res.json({ message: "Email verified" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) return res.status(403).json({ message: "Email not verified" });

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
