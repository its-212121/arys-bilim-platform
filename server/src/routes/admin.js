const express = require("express");
const bcrypt = require("bcryptjs");
const { auth, requireRole } = require("../middleware/auth");
const User = require("../models/User");
const Graduate = require("../models/Graduate");

const router = express.Router();

router.use(auth, requireRole("admin"));

// list users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  return res.json({ users });
});

// create teacher/admin account (or student if needed)
router.post("/create-user", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body || {};
    if (!fullName || !email || !password || !role) return res.status(400).json({ message: "Missing fields" });
    if (!["teacher", "admin", "student"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const created = await User.create({
      fullName: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role,
      isEmailVerified: true
    });

    return res.status(201).json({ user: { id: created._id, fullName: created.fullName, email: created.email, role: created.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// graduates CRUD
router.post("/graduates", async (req, res) => {
  try {
    const created = await Graduate.create(req.body || {});
    return res.status(201).json({ graduate: created });
  } catch (e) {
    return res.status(400).json({ message: "Invalid data" });
  }
});

router.put("/graduates/:id", async (req, res) => {
  try {
    const updated = await Graduate.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json({ graduate: updated });
  } catch (e) {
    return res.status(400).json({ message: "Bad request" });
  }
});

router.delete("/graduates/:id", async (req, res) => {
  try {
    const deleted = await Graduate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (e) {
    return res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
