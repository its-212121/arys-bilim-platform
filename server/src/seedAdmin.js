const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.log("ℹ️ ADMIN_EMAIL / ADMIN_PASSWORD not set. Skipping admin seed.");
    return;
  }

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("✅ Admin role updated for existing user:", email);
    } else {
      console.log("ℹ️ Admin already exists:", email);
    }
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await User.create({
    fullName: "Admin",
    email,
    passwordHash,
    role: "admin",
    isEmailVerified: true,
  });

  console.log("✅ Admin user created:", email);
}

module.exports = { seedAdmin };
