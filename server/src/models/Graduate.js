const mongoose = require("mongoose");

const GraduateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    university: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    entScore: { type: Number, default: null },
    satScore: { type: Number, default: null },
    ieltsScore: { type: Number, default: null },
    program: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Graduate", GraduateSchema);
