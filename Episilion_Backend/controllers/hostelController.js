const pool = require("../config/db.js"); // ✅ import pool

exports.getHostels = async (req, res) => {
  try {
    // ✅ Run queries with async/await
    const [hostels]   = await pool.query("SELECT * FROM hostels");
    const [pricing]   = await pool.query("SELECT * FROM pricing");
    const [locations] = await pool.query("SELECT * FROM locations");
    const [rooms]     = await pool.query("SELECT * FROM rooms");
    const [rules]     = await pool.query("SELECT * FROM rules");
    const [amenities] = await pool.query("SELECT * FROM amenities");
    const [furnishing]= await pool.query("SELECT * FROM furnishing");
    const [contacts]  = await pool.query("SELECT * FROM contact");
    const [media]     = await pool.query("SELECT * FROM media");

    // ✅ Build full hostel data
    const fullData = hostels.map(h => {
      const loc   = locations.find(l => l.hostel_id === h.hostel_id);
      const price = pricing.find(p => p.hostel_id === h.hostel_id);

      return {
        id: h.hostel_id,
        name: h.name,
        type: h.type,
        image: h.main_image,
        hostelPerks: h.hostel_perks,

        location: loc && {
          distanceToCampusMinutes: loc.distance_to_campus_in_minutes,
          distanceToCampusMeters: loc.distance_to_campus_in_meters,
          latitude: loc.latitude,
          longitude: loc.longitude,
          directions: loc.directions
        },

        pricing: price && {
          priceMin: price.price_min,
          priceMax: price.price_max,
          billingPeriod: price.billing_period,
          additionalFees: {
            utilities: price.utilities_fee,
            maintenance: price.maintenance_fee,
            cautionDeposit: price.caution_deposit
          },
          installmentAllowed: price.installment_allowed,
          refundPolicy: price.refund_policy
        },

        rooms: {
          types: rooms
            .filter(r => r.hostel_id === h.hostel_id)
            .map(r => ({
              type: r.room_type,
              price: r.price,
              availableRooms: r.available_rooms
            }))
        },

        amenities: amenities
          .filter(a => a.hostel_id === h.hostel_id)
          .map(a => a.amenity),

        furnishing: furnishing
          .filter(f => f.hostel_id === h.hostel_id)
          .map(f => f.furnishing),

        rules: rules
          .filter(r => r.hostel_id === h.hostel_id)
          .map(r => r.rule),

        contact: (() => {
          const c = contacts.find(x => x.hostel_id === h.hostel_id);
          return c && {
            managerName: c.manager_name,
            phone: c.phone,
            whatsapp: c.whatsapp,
            email: c.email,
            officeHours: c.office_hours,
            website: c.website
          };
        })(),

        reviews: {
          averageRating: h.average_rating,
          totalReviews: h.total_reviews
        },

        media: {
          images: media
            .filter(m => m.hostel_id === h.hostel_id)
            .map(m => ({
              url: m.url,
              type: m.type
            }))
        }
      };
    });

    res.json(fullData);

  } catch (err) {
    console.error("Error fetching hostels:", err);
    res.status(500).send("Error fetching hostels");
  }
};
