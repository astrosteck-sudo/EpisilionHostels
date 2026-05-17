const db = require("../config/db.js");

exports.getManagerDashboard = async (req, res) => {
  try {

    const hostelId = req.user.hostelId;

    // =========================
    // GET ROOM TYPES
    // =========================

    const roomQuery = `
      SELECT
        room_id,
        hostel_id,
        room_type,
        price
      FROM rooms
      WHERE hostel_id = ?
    `;

    db.query(roomQuery, [hostelId], (roomErr, roomResults) => {

      if (roomErr) {
        console.error(roomErr);

        return res.status(500).json({
          error: "Room query failed",
        });
      }

      // =========================
      // GET PRICING
      // =========================

      const pricingQuery = `
        SELECT
          price_min,
          price_max,
          installment_allowed,
          refund_policy,
          utilities_fee,
          maintenance_fee,
          caution_deposit
        FROM pricing
        WHERE hostel_id = ?
        LIMIT 1
      `;

      db.query(pricingQuery, [hostelId], (pricingErr, pricingResults) => {

        if (pricingErr) {
          console.error(pricingErr);

          return res.status(500).json({
            error: "Pricing query failed",
          });
        }

        // =========================
        // GET LOCATION
        // =========================

        const locationQuery = `
          SELECT
            directions,
            distance_to_campus_in_minutes
          FROM locations
          WHERE hostel_id = ?
          LIMIT 1
        `;

        db.query(locationQuery, [hostelId], (locationErr, locationResults) => {

          if (locationErr) {
            console.error(locationErr);

            return res.status(500).json({
              error: "Location query failed",
            });
          }

          return res.status(200).json({

            pricing:
              pricingResults.length > 0
                ? pricingResults[0]
                : {},

            location:
              locationResults.length > 0
                ? locationResults[0]
                : {},

            room_types: roomResults

          });

        });

      });

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Server error",
    });

  }
};


exports.updateManagerHostel = async (req, res) => {
  try {

    // HOSTEL ID FROM TOKEN
    const hostelId = req.user.hostelId;

    // DATA FROM FRONTEND
    const {
      minimum_price,
      maximum_price,
      installment_allowed,
      refunds_allowed,
      utilities,
      maintenance,
      caution_deposit,

      hostel_direction,
      around_hostel,
      distance_to_campus,

      room_types
    } = req.body;

    /*
      room_types expected format:

      [
        {
          id: 1,
          price: 5000
        },
        {
          id: 2,
          price: 3000
        }
      ]
    */

    // =========================
    // UPDATE PRICING TABLE
    // =========================

    const pricingQuery = `
      UPDATE pricing
      SET
        price_min = ?,
        price_max = ?,
        installment_allowed = ?,
        refund_policy = ?,
        utilities_fee = ?,
        maintenance_fee = ?,
        caution_deposit = ?
      WHERE hostel_id = ?
    `;

    db.query(
      pricingQuery,
      [
        minimum_price,
        maximum_price,
        installment_allowed,
        refunds_allowed,
        utilities,
        maintenance,
        caution_deposit,
        hostelId
      ],
      (pricingErr) => {

        if (pricingErr) {
          console.error(pricingErr);

          return res.status(500).json({
            error: "Pricing update failed",
          });
        }

        // =========================
        // UPDATE LOCATION TABLE
        // =========================

        const locationQuery = `
          UPDATE locations
          SET
            directions = ?,
            distance_to_campus_in_minutes = ?
          WHERE hostel_id = ?
        `;

        db.query(
          locationQuery,
          [
            hostel_direction,
            distance_to_campus,
            hostelId
          ],
          (locationErr) => {

            if (locationErr) {
              console.error(locationErr);

              return res.status(500).json({
                error: "Location update failed",
              });
            }

            // =========================
            // UPDATE ROOM TYPES
            // =========================

            if (
              room_types &&
              Array.isArray(room_types)
            ) {

              room_types.forEach((room) => {

                const roomQuery = `
                  UPDATE rooms
                  SET price = ?
                  WHERE room_id = ?
                  AND hostel_id = ?
                `;

                db.query(
                  roomQuery,
                  [
                    room.price,
                    room.room_id,
                    hostelId
                  ]
                );

              });

            }

            return res.status(200).json({
              message: "Hostel updated successfully",
            });

          }
        );

      }
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Server error",
    });

  }
};