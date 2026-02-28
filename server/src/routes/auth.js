const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || "student" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNorm = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

module.exports = router;
