require("dotenv").config();

const mysql = require("mysql2");


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }// important for Railway
})


//THIS CODE RUNS EVERY MIDNIGHT TO DELETE ANY REVIEW THAT IS MORE THAN 2 MONTHS OLD and then it recalculates the average rating and total reviews for all hostels in the database every 24 hours
const cron = require("node-cron")
cron.schedule("0 0 * * *", () => {
  console.log("Running cleanup...");

  // 1️⃣ Delete old reviews
  db.query(`
    DELETE FROM reviews
    WHERE created_at <= NOW() - INTERVAL 2 MONTH
  `, (err) => {
    if (err) return console.log(err);

    // 2️⃣ Recalculate ALL hostels
    const updateSql = `
      UPDATE hostels h
      LEFT JOIN (
        SELECT 
          hostel_id,
          COUNT(*) AS total_reviews,
          IFNULL(AVG(rating), 0) AS avg_rating
        FROM reviews
        GROUP BY hostel_id
      ) r ON h.hostel_id = r.hostel_id
      SET 
        h.total_reviews = IFNULL(r.total_reviews, 0),
        h.average_rating = IFNULL(r.avg_rating, 0);
    `;

    db.query(updateSql, (err2) => {
      if (err2) console.log(err2);
      else console.log("Hostels updated after cleanup ✅");
    });
  });
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database ✅");
  }
});

module.exports = db;