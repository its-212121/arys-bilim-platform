const express = require("express");
const Achievement = require("../models/Achievement");
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

const router = express.Router();

// public portfolio
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("fullName email role isEmailVerified");
    if (!user) return res.status(404).json({ message: "User not found" });

    const achievements = await Achievement.find({ userId }).sort({ date: -1 });
    const portfolio = await Portfolio.findOne({ userId });

    return res.json({
      user,
      portfolio: portfolio || { aboutMe: "", motivationLetter: "" },
      achievements
    });
  } catch (e) {
    return res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
