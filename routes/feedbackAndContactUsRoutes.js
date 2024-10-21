const express = require("express");
const router = express.Router();
const feedbackAndContactUsController = require("../controllers/Feedback and Contact Us/feedbackAndContactUsController");

router.get("/", feedbackAndContactUsController.getFeedbackAndContactUs);

module.exports = router;
