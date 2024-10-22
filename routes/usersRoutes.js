const express = require("express");
const router = express.Router();
const usersController = require("../controllers/Users/usersController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", usersController.getAllUsers);
router.get("/me", verifyToken, usersController.get_user_details);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
