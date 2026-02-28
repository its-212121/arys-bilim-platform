const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendVerificationCodeEmail } = require("../utils/email");

const router = express.Router();

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const genCode6 = () => String(Math.floor(100000 + Math.random() * 900000));
const hashCode = (code) =>
  crypto.createHash("sha256").update(String(code)).digest("hex");

const sendEmailWithTimeout = async (toEmail, code) => {
  await Promise.race([
    sendVerificationCodeEmail(toEmail, code),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout")), 8000)
    ),
  ]);
};

router.post("/register", async (req, res) => {
  try {
    const { name, fullName, email, password } = req.body;

    const actualName = (fullName || name || "").trim();

    if (!actualName || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    const emailNorm = String(email).trim().toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const code = genCode6();
    const codeHash = hashCode(code);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const existing = await User.findOne({ email: emailNorm });

    if (existing) {
      if (existing.isEmailVerified) {
        return res.status(400).json({ message: "Email already exists" });
      }

      existing.fullName = actualName;
      existing.passwordHash = passwordHash;
      existing.isEmailVerified = false;
      existing.verificationCodeHash = codeHash;
      existing.verificationCodeExpires = expires;
      await existing.save();

      try {
        await sendEmailWithTimeout(emailNorm, code);
      } catch (e) {
        return res.status(500).json({
          message:
            "Failed to send verification email. Check SMTP_USER/SMTP_PASS in Render.",
        });
      }

      return res.status(200).json({
        message: "Verification code sent to email",
        verificationRequired: true,
        email: emailNorm,
      });
    }

    await User.create({
      fullName: actualName,
      email: emailNorm,
      passwordHash,
      role: "student",
      isEmailVerified: false,
      verificationCodeHash: codeHash,
      verificationCodeExpires: expires,
    });

    try {
      await sendEmailWithTimeout(emailNorm, code);
    } catch (e) {
      return res.status(500).json({
        message:
          "Failed to send verification email. Check SENDGRID_API_KEY and FROM_EMAIL in Render.",
      });
    }

    return res.status(201).json({
      message: "Verification code sent to email",
      verificationRequired: true,
      email: emailNorm,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "email and code are required" });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      const token = signToken(user);
      return res.json({ message: "Already verified", token });
    }

    if (!user.verificationCodeHash || !user.verificationCodeExpires) {
      return res.status(400).json({ message: "No verification code. Please register again." });
    }

    if (user.verificationCodeExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "Code expired. Please resend code." });
    }

    const incomingHash = hashCode(code);
    if (incomingHash !== user.verificationCodeHash) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.isEmailVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    const token = signToken(user);
    return res.json({ message: "Email verified", token });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email is required" });

    const emailNorm = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) return res.json({ message: "Already verified" });

    const code = genCode6();
    user.verificationCodeHash = hashCode(code);
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmailWithTimeout(emailNorm, code);
    } catch (e) {
      return res.status(500).json({
        message:
          "Failed to send verification email. Check SMTP_USER/SMTP_PASS in Render.",
      });
    }

    return res.json({ message: "Verification code resent" });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNorm = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.passwordHash) {
      return res.status(400).json({
        message: "Account data is broken. Please re-register.",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Email not verified",
        verificationRequired: true,
        email: emailNorm,
      });
    }

    const token = signToken(user);
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

module.exports = router;
  
