const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    category: { type: String, default: "" },
    certificateUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", AchievementSchema);
