const express = require("express");
const router = express.Router();
const learnToSwimController = require("../controllers/learnToSwimController");

// Routes for managing Learn to Swim levels
router.get("/levels", learnToSwimController.getLearnToSwimLevels); // Get Learn to Swim Levels
router.post("/levels", learnToSwimController.addLearnToSwimLevel); // Create Learn to Swim Level
router.put("/levels/:id", learnToSwimController.updateLearnToSwimLevel); // Update Learn to Swim Level by ID
router.delete("/levels/:id", learnToSwimController.deleteLearnToSwimLevel); // Delete Learn to Swim Level by ID

// Routes for managing Learn to Swim sections
router.get("/sections", learnToSwimController.getLearnToSwimSections); // Get Learn to Swim Sections
router.post("/sections", learnToSwimController.addLearnToSwimSection); // Create Learn to Swim Section
router.put("/sections/:id", learnToSwimController.updateLearnToSwimSection); // Update Learn to Swim Section by ID
router.delete("/sections/:id", learnToSwimController.deleteLearnToSwimSection); // Delete Learn to Swim Section by ID

module.exports = router;