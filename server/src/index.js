require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./db");
const { CLIENT_ORIGIN, UPLOADS_DIR } = require("./config");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const achievementsRoutes = require("./routes/achievements");
const portfolioRoutes = require("./routes/portfolio");
const graduatesRoutes = require("./routes/graduates");
const adminRoutes = require("./routes/admin");

const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/graduates", graduatesRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ message: err.message || "Upload error" });
  next();
});

const port = process.env.PORT || 4000;

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ℹ️ ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin seed");
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("ℹ️ Admin already exists:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    email,
    fullName: "Admin",
    passwordHash,
    role: "admin",
    isVerified: true,
  });

  console.log("✅ Admin created:", email);
}

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in env");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in env");

    await connectDB(process.env.MONGO_URI);
    await ensureAdmin();

    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } catch (e) {
    console.error("❌ Server failed to start:", e.message);
    process.exit(1);
  }
})();
