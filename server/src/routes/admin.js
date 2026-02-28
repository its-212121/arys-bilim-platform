const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/users", auth, requireAdmin, async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const name = String(fullName || "").trim();
    const emailNorm = String(email || "").trim().toLowerCase();
    const pass = String(password || "");

    if (!name || !emailNorm || !pass) {
      return res.status(400).json({ message: "fullName, email, password are required" });
    }

    const existing = await User.findOne({ email: emailNorm });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);

    const user = await User.create({
      fullName: name,
      email: emailNorm,
      passwordHash,
      role: role || "student",
    });

    return res.status(201).json({
      message: "User created",
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

module.exports = router;
