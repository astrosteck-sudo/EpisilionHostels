const pool = require("../config/db.js"); // ✅ import pool directly

// Add favorite hostel
const addFavoriteService = async (userId, hostelId) => {
  // 1️⃣ Check if hostel exists
  const [hostelCheck] = await pool.query(
    "SELECT hostel_id FROM hostels WHERE hostel_id = ?",
    [hostelId]
  );

  if (hostelCheck.length === 0) {
    throw new Error("Hostel not found");
  }

  // 2️⃣ Add favorite (avoid duplicates)
  await pool.query(
    `
    INSERT INTO favorites (user_id, hostel_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE user_id = user_id
    `,
    [userId, hostelId]
  );

  // 3️⃣ Query back the inserted/updated row
  const [favorite] = await pool.query(
    "SELECT * FROM favorites WHERE user_id = ? AND hostel_id = ?",
    [userId, hostelId]
  );

  return favorite[0];
};

// Get all favorites for a user
const getFavoritesService = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      h.hostel_id,
      h.name,
      h.main_image,
      l.latitude,
      l.longitude,
      (
        SELECT JSON_ARRAYAGG(
                 JSON_OBJECT('id', a.id, 'name', a.amenity)
               )
        FROM (
            SELECT id, amenity 
            FROM amenities 
            WHERE hostel_id = h.hostel_id 
            ORDER BY amenity 
            LIMIT 3
        ) AS a
      ) AS amenities,
      p.price_min
    FROM favorites f
    JOIN hostels h ON f.hostel_id = h.hostel_id
    LEFT JOIN locations l ON h.hostel_id = l.hostel_id
    LEFT JOIN pricing p ON h.hostel_id = p.hostel_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC;
    `,
    [userId]
  );

  return rows;
};

// Remove favorite hostel
const removeFavoriteService = async (userId, hostelId) => {
  // 1️⃣ Fetch the favorite before deleting
  const [favorite] = await pool.query(
    "SELECT * FROM favorites WHERE user_id = ? AND hostel_id = ?",
    [userId, hostelId]
  );

  if (favorite.length === 0) {
    throw new Error("Favorite not found");
  }

  // 2️⃣ Delete the favorite
  await pool.query(
    "DELETE FROM favorites WHERE user_id = ? AND hostel_id = ?",
    [userId, hostelId]
  );

  // 3️⃣ Return the previously fetched favorite
  return favorite[0];
};

module.exports = {
  addFavoriteService,
  getFavoritesService,
  removeFavoriteService,
};
