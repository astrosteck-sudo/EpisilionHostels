const pool = require("../config/db.js"); // ✅ import pool
const bcrypt = require("bcrypt");

/**
 * GET Manager Dashboard
 */
exports.getManagerDashboard = async (req, res) => {
  try {
    const hostelId = req.user.hostelId;

    // ✅ Run queries with async/await
    const [roomResults] = await pool.query(
      `SELECT room_id, hostel_id, room_type, price FROM rooms WHERE hostel_id = ?`,
      [hostelId]
    );

    const [pricingResults] = await pool.query(
      `SELECT price_min, price_max, installment_allowed, refund_policy,
              utilities_fee, maintenance_fee, caution_deposit
       FROM pricing WHERE hostel_id = ? LIMIT 1`,
      [hostelId]
    );

    const [locationResults] = await pool.query(
      `SELECT directions, distance_to_campus_in_minutes
       FROM locations WHERE hostel_id = ? LIMIT 1`,
      [hostelId]
    );

    return res.status(200).json({
      pricing: pricingResults.length > 0 ? pricingResults[0] : {},
      location: locationResults.length > 0 ? locationResults[0] : {},
      room_types: roomResults,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * UPDATE Manager Hostel
 */
exports.updateManagerHostel = async (req, res) => {
  try {
    const hostelId = req.user.hostelId;
    const {
      minimum_price,
      maximum_price,
      installment_allowed,
      refunds_allowed,
      utilities,
      maintenance,
      caution_deposit,
      hostel_direction,
      distance_to_campus,
      room_types,
    } = req.body;

    // ✅ Update pricing
    await pool.query(
      `UPDATE pricing
       SET price_min = ?, price_max = ?, installment_allowed = ?, refund_policy = ?,
           utilities_fee = ?, maintenance_fee = ?, caution_deposit = ?
       WHERE hostel_id = ?`,
      [
        minimum_price,
        maximum_price,
        installment_allowed,
        refunds_allowed,
        utilities,
        maintenance,
        caution_deposit,
        hostelId,
      ]
    );

    // ✅ Update location
    await pool.query(
      `UPDATE locations
       SET directions = ?, distance_to_campus_in_minutes = ?
       WHERE hostel_id = ?`,
      [hostel_direction, distance_to_campus, hostelId]
    );

    // ✅ Update room types
    if (room_types && Array.isArray(room_types)) {
      for (const room of room_types) {
        await pool.query(
          `UPDATE rooms SET price = ? WHERE room_id = ? AND hostel_id = ?`,
          [room.price, room.room_id, hostelId]
        );
      }
    }

    return res.status(200).json({ message: "Hostel updated successfully ✅" });
  } catch (error) {
    console.error("Update hostel error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * UPDATE Manager Password
 */
exports.updateManagerPassword = async (req, res) => {
  try {
    const managerId = req.user.managerId;
    const {
      hostelManagerOldpassword,
      hostelMangerNewPaswword,
      hostelManagerComfirmPassword,
    } = req.body;

    // ✅ Validation
    if (!hostelManagerOldpassword || !hostelMangerNewPaswword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (hostelMangerNewPaswword !== hostelManagerComfirmPassword) {
      return res.status(400).json({ error: "Password mismatch" });
    }

    // ✅ Get manager
    const [results] = await pool.query(
      `SELECT * FROM hostel_managers WHERE id = ? LIMIT 1`,
      [managerId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const manager = results[0];

    // ✅ Check current password
    const isMatch = await bcrypt.compare(
      hostelManagerOldpassword,
      manager.password_hash
    );
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(hostelMangerNewPaswword, 10);

    // ✅ Update password
    await pool.query(
      `UPDATE hostel_managers SET password_hash = ? WHERE id = ?`,
      [hashedPassword, managerId]
    );

    return res.status(200).json({ message: "Password updated successfully ✅" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
