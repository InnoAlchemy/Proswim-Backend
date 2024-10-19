const express = require("express");
const router = express.Router();
const usersController = require("../controllers/Users/usersController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", usersController.getAllUsers);
router.get("/user/:id", verifyToken, usersController.get_user_details);

module.exports = router;
