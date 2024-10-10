const express = require("express");
const router = express.Router();
const learnToSwimController = require("../controllers/Learn to Swim/learnToSwimController");
const upload = require("../helper/uploadHandler");
const mulipleUpload = require("../helper/mulitpleUploadHandler");

// Routes for managing Learn to Swim levels
router.get("/levels", learnToSwimController.getLearnToSwimLevels); // Get Learn to Swim Levels
router.post(
  "/levels",
  upload.single("header_image"),
  learnToSwimController.addLearnToSwimLevel
); // Create Learn to Swim Level
router.put(
  "/levels/:id",
  upload.single("header_image"),
  learnToSwimController.updateLearnToSwimLevel
); // Update Learn to Swim Level by ID
router.delete("/levels/:id", learnToSwimController.deleteLearnToSwimLevel); // Delete Learn to Swim Level by ID

// Routes for managing Learn to Swim sections
router.get("/sections", learnToSwimController.getLearnToSwimSections); // Get Learn to Swim Sections
router.post(
  "/sections",
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "header_image", maxCount: 5 },
  ]),
  learnToSwimController.addLearnToSwimSection
); // Create Learn to Swim Section
router.put(
  "/sections/:id",
  upload.array("image"),
  learnToSwimController.updateLearnToSwimSection
); // Update Learn to Swim Section by ID
router.delete("/sections/:id", learnToSwimController.deleteLearnToSwimSection); // Delete Learn to Swim Section by ID

module.exports = router;
