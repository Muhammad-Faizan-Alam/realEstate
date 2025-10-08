require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();
connectDB();

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  credentials: true // allow cookies to be sent
}));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/project-details", require("./routes/projectDetails"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/properties", require("./routes/propertyDetailRoutes"));
app.use("/api/agencies", require("./routes/agencyRoutes"));
app.use("/api/partners", require("./routes/partners"));
app.use("/api/agents", require("./routes/agents"));
app.use("/api/developers", require("./routes/developers"));
app.use("/api/city-profiles", require("./routes/cityProfiles"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));