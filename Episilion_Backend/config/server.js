const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.js");
const db = require("../config/db.js"); // Import the MySQL connection

const app = express();
const PORT = process.env.PORT || 3000;

//THIS FUNCTION READS THE JSON FILES IN THE DATA FOLDER AND RETURNS THE PARSED JSON OBJECT
// function readData(filename) {
//   const filePath = path.join(__dirname, filename);
//   const raw = fs.readFileSync(filePath, "utf-8");
//   return JSON.parse(raw);
// }

//THIS MAKES THE IMAGES IN THE PUBLIC FOLDER ACCESSIBLE TO THE FRONTEND
app.use("/images", express.static("public/images")); // Serve images from the public/images directory
console.log("Static Images served at /images");

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors()); // Allow requests from any frontend origin
app.use(express.json()); // Parse JSON request bodies

// ── Database Routes ────────────────────────────────────────────────────────────────
//THIS IS FOR PUTTIN HOSTELS IN THE DATABASE
app.post("/api/hostels", (req, res) => {
  const {
    id,
    name,
    type,
    university,
    yearEstablished,
    distance,
    hostelPerks,
    image,
  } = req.body;

  const sql = `
    INSERT INTO Hostels 
    (hostel_id, name, type, university, year_established, distance, hostel_perks, main_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [id, name, type, university, yearEstablished, distance, hostelPerks, image],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error inserting hostel");
      } else {
        res.send("Hostel added successfully ✅");
      }
    },
  );
});



// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/hostels", require("../routes/hostels.js"));
app.use("/api/reviews", require("../routes/reviews.js"));
app.use("/api/auth", require("../routes/auth.js"));
app.use("/api/intent", require("../routes/intent.js"));
app.use("/api/favorites", require("../routes/favoritesRoutes.js"));
app.use("/api/manager/auth", require("../routes/managerAuthRoutes.js"));
app.use("/api/manager", require("../routes/managerDashboardRoutes.js"));
app.use("/api/manager", require("../routes/managerDashboardRoutes.js"));

// ── Routes ────────────────────────────────────────────────────────────────────
// GET /api/teamMembers  → return only the teamMembers array
app.get("/api/teamMembers", (req, res) => {
  try {
    const teamMembers = readData("../data/team_Members_data.json");
    //console.log("Team Members data sent:", teamMembers);
    res.json({ success: true, teamMembers });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to read team Members file." });
  }
});
// GET /api/moreProjects  → return only the moreProjects array
app.get("/api/moreProjects", (req, res) => {
  try {
    const moreProjects = readData("../data/More_From_Us.json");
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
  console.log(`   GET /api/manager/dashboard`)
  console.log(`   PUT /api/manager/update-hostel`)
});
