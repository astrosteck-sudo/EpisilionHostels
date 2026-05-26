require("dotenv").config();
const mysql = require("mysql2/promise"); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // important for Railway
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test connection once at startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to MySQL database ✅");
    conn.release(); // release back to pool
  } catch (err) {
    console.error("Database connection failed ❌:", err.message);
  }
})();

// Cron job: delete old reviews + recalc ratings
const cron = require("node-cron");
cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup...");

  try {
    await pool.query(`
      DELETE FROM reviews
      WHERE created_at <= NOW() - INTERVAL 2 MONTH
    `);

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

    await pool.query(updateSql);
    console.log("Hostels updated after cleanup ✅");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

module.exports = pool;
