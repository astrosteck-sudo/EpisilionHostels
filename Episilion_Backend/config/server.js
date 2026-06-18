const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const passport = require("./passport.js");
const session = require("express-session");

require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3000;

//THIS MAKES THE IMAGES IN THE PUBLIC FOLDER ACCESSIBLE TO THE FRONTEND
app.use("/images", express.static("public/images")); // Serve images from the public/images directory
console.log("Static Images served at /images");

function readData(filename) {
  const filePath = path.join(__dirname, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors()); // Allow requests from any frontend origin
app.use("/api/payments/webhook", express.raw({ type: "*/*" }));
app.use(express.json()); // Parse JSON request bodies

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.initialize());
app.use(passport.session());
// ── Database Routes ────────────────────────────────────────────────────────────────
app.use("/api/hostels", require("../routes/hostels.js"));
app.use("/api/reviews", require("../routes/reviews.js"));
app.use("/api/auth", require("../routes/auth.js"));
app.use("/api/intent", require("../routes/intent.js"));
app.use("/api/favorites", require("../routes/favoritesRoutes.js"));
app.use("/api/manager/auth", require("../routes/managerAuthRoutes.js"));
app.use("/api/manager", require("../routes/managerDashboardRoutes.js"));
app.use("/api/manager", require("../routes/managerDashboardRoutes.js"));
app.use("/api/manager", require("../routes/managerDashboardRoutes.js"));
app.use("/api/payments/webhook", express.raw({ type: "*/*" }));
app.use("/api/payments", require("../routes/paymentRoutes.js"));
app.use("/api", require("../routes/userRoutes"));

// ── Routes ────────────────────────────────────────────────────────────────────
// GET /api/teamMembers  → return only the teamMembers array
app.get("/api/teamMembers", (req, res) => {
  try {
    const teamMembers = readData("../data/team_Members_data.json");
    res.json({ success: true, teamMembers });
  } catch (err) {
    console.error("Error reading team members file:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to read team Members file." });
  }
});

// GET /api/moreProjects  → return only the moreProjects array
app.get("/api/moreProjects", (req, res) => {
  try {
    const moreProjects = readData("./data/More_From_Us.json");
    res.json({ success: true, moreProjects });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to read more Projects file." });
  }
});
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   GET /api/hostels`);
  console.log(`   GET /api/teamMembers`);
  console.log(`   GET /api/moreProjects`);
  console.log(`   POST /api/reviews`);
  console.log(`   GET /api/reviews/:hostelId`);
  console.log(`   POST /api/signup`);
  console.log(`   POST /api/login`);
  console.log(`   POST /api/intent/search`);
  console.log(`   POST /api/favorites`);
  console.log(`   GET /api/favorites`);
  console.log(`   DELETE /api/favorites/:hostelId`);
  console.log(`   POST /api/manager/auth`);
  console.log(`   GET /api/manager`);
  console.log(`   PUT /api/manager`);
  
});
