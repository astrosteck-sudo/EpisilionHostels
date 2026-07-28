const express = require("express");
const router = express.Router();

const {
    subscribeNewsletter,
    joinWaitlist,
} = require("../controllers/subscriberController");

router.post("/newsletter", subscribeNewsletter);

router.post("/waitlist", joinWaitlist);

module.exports = router;