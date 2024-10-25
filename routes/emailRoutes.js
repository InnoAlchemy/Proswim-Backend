const express = require("express");
const router = express.Router();

const { sendEmail } = require("../controllers/Email/emailController"); // Import the sendEmail controller

router.post("/", sendEmail);

module.exports = router;
