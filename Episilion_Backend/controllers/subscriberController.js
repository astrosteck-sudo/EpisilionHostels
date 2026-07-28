const pool = require("../config/db.js");

// =========================
// Newsletter Subscription
// =========================
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const [existing] = await pool.query(
            "SELECT id, is_active FROM newsletter_subscribers WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            if (existing[0].is_active) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already subscribed.",
                });
            }

            await pool.query(
                "UPDATE newsletter_subscribers SET is_active = TRUE WHERE email = ?",
                [email]
            );

            return res.status(200).json({
                success: true,
                message: "Newsletter subscription reactivated.",
            });
        }

        await pool.query(
            "INSERT INTO newsletter_subscribers (email) VALUES (?)",
            [email]
        );

        res.status(201).json({
            success: true,
            message: "Successfully subscribed to the newsletter.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// =========================
// Waitlist Subscription
// =========================
const joinWaitlist = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const [existing] = await pool.query(
            "SELECT id, is_active FROM waitlist_subscribers WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            if (existing[0].is_active) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already on the waitlist.",
                });
            }

            await pool.query(
                "UPDATE waitlist_subscribers SET is_active = TRUE WHERE email = ?",
                [email]
            );

            return res.status(200).json({
                success: true,
                message: "Waitlist subscription reactivated.",
            });
        }

        await pool.query(
            "INSERT INTO waitlist_subscribers (email) VALUES (?)",
            [email]
        );

        res.status(201).json({
            success: true,
            message: "Successfully joined the waitlist.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

module.exports = {
    subscribeNewsletter,
    joinWaitlist,
};