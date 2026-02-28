const express = require("express");
const Graduate = require("../models/Graduate");

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Graduate.find().sort({ year: -1, createdAt: -1 });
  return res.json({ graduates: items });
});

router.get("/:id", async (req, res) => {
  try {
    const g = await Graduate.findById(req.params.id);
    if (!g) return res.status(404).json({ message: "Not found" });
    return res.json({ graduate: g });
  } catch (e) {
    return res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
