require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");
const User = require("./models/User");

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) throw new Error("ADMIN_EMAIL/ADMIN_PASSWORD missing in .env");

    await connectDB(process.env.MONGO_URI);

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      console.log("ℹ️ Admin already exists:", exists.email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const admin = await User.create({
      fullName: "Admin",
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: "admin",
      isEmailVerified: true
    });

    console.log("✅ Admin created:", admin.email);
    process.exit(0);
  } catch (e) {
    console.error("❌ seed:admin failed:", e.message);
    process.exit(1);
  }
})();
