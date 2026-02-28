const express = require("express");
const Achievement = require("../models/Achievement");
const Portfolio = require("../models/Portfolio");
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const items = await Achievement.find({ userId: req.user._id }).sort({ date: -1 });
  const portfolio = await Portfolio.findOne({ userId: req.user._id });
  return res.json({ achievements: items, portfolio: portfolio || { aboutMe: "", motivationLetter: "" } });
});

router.post("/", auth, upload.single("certificate"), async (req, res) => {
  try {
    const { title, description, date, category } = req.body || {};
    if (!title || !date) return res.status(400).json({ message: "Title and date are required" });

    const certificateUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const created = await Achievement.create({
      userId: req.user._id,
      title: String(title).trim(),
      description: String(description || ""),
      date: new Date(date),
      category: String(category || ""),
      certificateUrl
    });

    return res.status(201).json({ achievement: created });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Achievement.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  return res.json({ message: "Deleted" });
});

router.put("/portfolio/me", auth, async (req, res) => {
  const { aboutMe, motivationLetter } = req.body || {};
  const updated = await Portfolio.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { aboutMe: String(aboutMe || ""), motivationLetter: String(motivationLetter || "") } },
    { upsert: true, new: true }
  );
  return res.json({ portfolio: updated });
});

module.exports = router;
