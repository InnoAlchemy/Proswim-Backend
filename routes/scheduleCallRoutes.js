const express = require("express");
const router = express.Router();
const scheduleCallController = require("../controllers/Schedule Call/scheduleCallController");

router.post("/", scheduleCallController.submitScheduleCallForm);
router.get("/", scheduleCallController.getScheduleCallFormSubmissions);
router.delete("/:id", scheduleCallController.deleteScheduleCallFormSubmission);

module.exports = router;
