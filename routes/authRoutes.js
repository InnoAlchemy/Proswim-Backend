const express = require("express");
const router = express.Router();
const authController = require("../controllers/Authentication/authController");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/google-signin", authController.google_signin);
router.post("/forgot-password", authController.forgot_password);
router.post("/send-otp", authController.send_otp);
router.post("/verify-otp", authController.verify_otp);
router.get("/me", authController.get_user_details);

module.exports = router;
