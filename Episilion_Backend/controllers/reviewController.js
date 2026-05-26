const pool = require("../config/db.js"); // ✅ import pool

/**
 * POST /reviews
 */
exports.addReview = async (req, res) => {
  const userId = req.user.user_id;
  const { hostel_id, rating, review_text } = req.body;

  if (!hostel_id || !rating) {
    return res.status(400).json({ error: "hostel_id and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // 1️⃣ Insert review
    const insertSql = `
      INSERT INTO reviews (hostel_id, user_id, rating, review_text)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(insertSql, [
      hostel_id,
      userId,
      rating,
      review_text
    ]);

    // 2️⃣ Update hostel stats
    const updateSql = `
      UPDATE hostels
      SET 
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE hostel_id = ?),
        average_rating = (SELECT IFNULL(AVG(rating), 0) FROM reviews WHERE hostel_id = ?)
      WHERE hostel_id = ?
    `;
    await pool.query(updateSql, [hostel_id, hostel_id, hostel_id]);

    res.json({
      message: "Review added successfully ✅",
      reviewId: result.insertId
    });

  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Database error" });
  }
};

/**
 * GET /reviews/:hostelId
 */
exports.getReviews = async (req, res) => {
  const { hostelId } = req.params;

  const sql = `
    SELECT 
      r.review_id,
      r.rating,
      r.review_text AS reviewText,
      u.name
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.hostel_id = ?
    ORDER BY r.created_at DESC
  `;

  try {
    const [rows] = await pool.query(sql, [hostelId]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};
