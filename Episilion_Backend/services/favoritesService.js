const db = require("../db");

const addFavoriteService = async (userId, hostelId) => {
  const pool = db.promise(); // wrap for async/await

  // 1️⃣ Check if hostel exists
  const [hostelCheck] = await pool.query(
    "SELECT hostel_id FROM hostels WHERE hostel_id = ?",
    [hostelId],
  );

  if (hostelCheck.length === 0) {
    throw new Error("Hostel not found");
  }

  // 2️⃣ Add favorite (avoid duplicates)
  const [result] = await pool.query(
    `
    INSERT INTO favorites (user_id, hostel_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE user_id = user_id
    `,
    [userId, hostelId],
  );

  // MySQL doesn’t support RETURNING * directly
  // If you want the inserted row, query it back:
  const [favorite] = await pool.query(
    "SELECT * FROM favorites WHERE user_id = ? AND hostel_id = ?",
    [userId, hostelId],
  );

  return favorite[0];
};

const getFavoritesService = async (userId) => {
  // Wrap the db connection in a promise interface so we can use async/await
  const pool = db.promise();

  // Query to fetch all favorite hostels for a given user
  // We join the favorites table with the hostels table to get hostel details
  // Only rows where f.user_id matches the provided userId are returned
  // Results are ordered by the time the favorite was created (newest first)
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
    [userId], // Parameter binding to prevent SQL injection
  );

  // Return the array of favorite hostels
  return rows;

  // Debug log to check the fetched data
};

const removeFavoriteService = async (userId, hostelId) => {
  const pool = db.promise();

  // 1️⃣ Fetch the favorite before deleting
  const [favorite] = await pool.query(
    "SELECT * FROM favorites WHERE user_id = ? AND hostel_id = ?",
    [userId, hostelId],
  );

  if (favorite.length === 0) {
    throw new Error("Favorite not found");
  }

  // 2️⃣ Delete the favorite
  await pool.query(
    "DELETE FROM favorites WHERE user_id = ? AND hostel_id = ?",
    [userId, hostelId],
  );

  // 3️⃣ Return the previously fetched favorite
  return favorite[0];
};

module.exports = {
  addFavoriteService,
  getFavoritesService,
  removeFavoriteService,
};

// module.exports = {
//   addFavoriteService,
// };
