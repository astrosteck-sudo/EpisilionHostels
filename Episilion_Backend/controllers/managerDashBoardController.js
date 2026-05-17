const db = require("../db");

exports.getManagerDashboard = async (req, res) => {
  try {
    // GET HOSTEL ID FROM TOKEN
    const hostelId = req.user.hostelId;

    // GET ROOM TYPES
    const roomQuery = `
      SELECT
        hostel_id,
        room_type,
        price
      FROM rooms
      WHERE hostel_id = ?
    `;

    db.query(roomQuery, [hostelId], (err, roomResults) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Database error",
        });
      }

    //   // GET HOSTEL DETAILS
    //   const hostelQuery = `
    //     SELECT
    //       id,
    //       hostel_name,
    //       directions,
    //       walking_time_minutes,
    //       minimum_price,
    //       maximum_price
    //     FROM hostels
    //     WHERE id = ?
    //     LIMIT 1
    //   `;

    //   db.query(hostelQuery, [hostelId], (err, hostelResults) => {
    //     if (err) {
    //       console.error(err);

    //       return res.status(500).json({
    //         error: "Database error",
    //       });
    //     }

    //     if (hostelResults.length === 0) {
    //       return res.status(404).json({
    //         error: "Hostel not found",
    //       });
    //     }
    //   });

      return res.status(200).json({
        //   hostel: hostelResults[0],

          room_types: roomResults,
        });
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};
