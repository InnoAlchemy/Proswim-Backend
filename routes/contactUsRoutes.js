const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/Feedback and Contact Us/contactUsController");

// Contact Us Routes
router.post("/", contactUsController.submitContactUsForm);
router.get("/", contactUsController.getContactUsFormSubmissions);
router.delete("/:id", contactUsController.deleteContactUsFormSubmission);

module.exports = router;
