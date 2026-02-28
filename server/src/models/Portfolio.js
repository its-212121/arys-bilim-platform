const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    aboutMe: { type: String, default: "" },
    motivationLetter: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);
