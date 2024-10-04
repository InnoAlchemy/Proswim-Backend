const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/Feedback and Contact Us/feedbackController");

// Feedback Routes
router.post("/", feedbackController.submitFeedback);
router.get("/", feedbackController.getFeedback);

module.exports = router;
