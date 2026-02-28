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

const app = express();

const allowedOrigins = String(process.env.CLIENT_ORIGIN || CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
  if (err) {
    return res.status(400).json({ message: err.message || "Upload error" });
  }
  next();
});

const port = process.env.PORT || 4000;

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } catch (e) {
    console.error("❌ Server failed to start:", e.message);
    process.exit(1);
  }
})();
