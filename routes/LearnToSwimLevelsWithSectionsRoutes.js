const express = require("express");
const router = express.Router();
const learnToSwimController = require("../controllers/Learn to Swim/learnToSwimController");

router.get("/", learnToSwimController.getLearnToSwimLevelsWithSections);

module.exports = router;
