const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth.js");
const db = require("./db"); // Import the MySQL connection

const app = express();
const PORT = process.env.PORT || 3000;

//THIS FUNCTION READS THE JSON FILES IN THE DATA FOLDER AND RETURNS THE PARSED JSON OBJECT
function readData(filename) {
  const filePath = path.join(__dirname, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

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

// app.get("/api/hostels", async (req, res) => {

//   const query = (sql, values = []) => {
//     return new Promise((resolve, reject) => {
//       db.query(sql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
//   };

//   try {
//     const hostels = await query("SELECT * FROM hostels");
//     const pricing = await query("SELECT * FROM pricing");
//     const locations = await query("SELECT * FROM locations");
//     const rooms = await query("SELECT * FROM rooms");
//     const rules = await query("SELECT * FROM rules");
//     const amenities = await query("SELECT * FROM amenities");
//     const furnishing = await query("SELECT * FROM furnishing");
//     const contacts = await query("SELECT * FROM contact");
//     const media = await query("SELECT * FROM media");

//     const fullData = hostels.map(h => {
//       const loc = locations.find(l => l.hostel_id === h.hostel_id);
//       const price = pricing.find(p => p.hostel_id === h.hostel_id);

//       return {
//         id: h.hostel_id,
//         name: h.name,
//         type: h.type,
//         image: h.main_image,
//         hostelPerks: h.hostel_perks,

//         location: loc && {
//           distanceToCampusMinutes: loc.distance_to_campus_in_minutes,
//           distanceToCampusMeters: loc.distance_to_campus_in_meters,
//           latitude: loc.latitude,
//           longitude: loc.longitude,
//           directions: loc.directions
//         },

//         pricing: price && {
//           priceMin: price.price_min,
//           priceMax: price.price_max,
//           billingPeriod: price.billing_period,
//           additionalFees: {
//             utilities: price.utilities_fee,
//             maintenance: price.maintenance_fee,
//             cautionDeposit: price.caution_deposit
//           },
//           refundPolicy: price.refund_policy
//         },

//         rooms: {
//           //THIS FILTERS THE ROOMS TO ONLY SHOW THE ROOMS THAT BELONG TO THE HOSTEL AND THEN MAPS THEM TO THE CORRECT FORMAT
//           types: rooms.filter(r => r.hostel_id === h.hostel_id).map(r => ({
//             type: r.room_type,
//             price: r.price,
//             availableRooms: r.available_rooms
//           }))
//         },
//         amenities: amenities.filter(a => a.hostel_id === h.hostel_id).map(a => a.amenity),
//         furnishing: furnishing.filter(f => f.hostel_id === h.hostel_id).map(f => f.furnishing),
//         rules: rules.filter(r => r.hostel_id === h.hostel_id).map(r => r.rule),

//         contact: (() => {
//           const c = contacts.find(x => x.hostel_id === h.hostel_id);

//           return c && {
//             managerName: c.manager_name,
//             phone: c.phone,
//             whatsapp: c.whatsapp,
//             email: c.email,
//             officeHours: c.office_hours,
//             website: c.website
//           };
//         })(),

//         reviews: {
//           averageRating: h.average_rating,
//           totalReviews: h.total_reviews
//         },

//         media: {
//           images: media.filter(m => m.hostel_id === h.hostel_id).map(m => ({
//             url: m.url,
//             type: m.type
//           })),

//           //video: videos.find(v => v.hostel_id === h.hostel_id)?.url || null
//         }
//       };
//     });

//     res.json(fullData);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
// });

//THIS IS FOR ADDING REVIEWS TO THE DATABASE
app.use("/api/hostels", require("./routes/hostels"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/intent", require("./routes/intent"));
app.use("/api/favorites", require("./routes/favoritesRoutes.js"));
app.use("/api/manager/auth", require("./routes/managerAuthRoutes"));

// ── Routes ────────────────────────────────────────────────────────────────────
// GET /api/teamMembers  → return only the teamMembers array

app.get("/api/teamMembers", (req, res) => {
  try {
    const teamMembers = readData("./data/team_Members_data.json");
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
    const moreProjects = readData("./data/More_From_Us.json");
    res.json({ success: true, moreProjects });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to read more Projects file." });
  }
});

//THIS IS FOR SIGNING UP USERS AND STORING THEM IN THE DATABASE
// If you also want form data:
//app.use(express.urlencoded({ extended: true }));

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
});

// // GET /api/users  → return only the users array
// app.get("/api/users", (req, res) => {
//   try {
//     const { users } = readData();
//     res.json({ success: true, count: users.length, data: users });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to read users." });
//   }
// });

// // GET /api/users/:id  → return a single user by id
// app.get("/api/users/:id", (req, res) => {
//   try {
//     const { users } = readData();
//     const user = users.find((u) => u.id === parseInt(req.params.id));
//     if (!user) return res.status(404).json({ success: false, message: "User not found." });
//     res.json({ success: true, data: user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to read users." });
//   }
// });

// // GET /api/products  → return only the products array
// app.get("/api/products", (req, res) => {
//   try {
//     const { products } = readData();
//     res.json({ success: true, count: products.length, data: products });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to read products." });
//   }
// });

// // GET /api/products/:id  → return a single product by id
// app.get("/api/products/:id", (req, res) => {
//   try {
//     const { products } = readData();
//     const product = products.find((p) => p.id === parseInt(req.params.id));
//     if (!product) return res.status(404).json({ success: false, message: "Product not found." });
//     res.json({ success: true, data: product });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to read products." });
//   }
// });

//THIS ADDED THE RANDOM ID'S TO THE HOSTELS

// //import fs from "fs";
// const crypto = require("crypto");

// // Load existing JSON file
// const data = fs.readFileSync("hostel_data.json", "utf-8");
// const hostels = JSON.parse(data);
// //hostel_data.json
// // Assign a UUID string to each hostel
// hostels.forEach(hostel => {
//   if (hostel.id != "") {
//     hostel.id = crypto.randomUUID();
//   }
// });

// Save back to JSON
//fs.writeFileSync("hostel_data.json", JSON.stringify(hostels, null, 2));

//console.log("UUIDs added to hostels!");
