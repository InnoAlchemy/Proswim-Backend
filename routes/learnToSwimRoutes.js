const express = require("express");
const router = express.Router();
const learnToSwimController = require("../controllers/learnToSwimController");

router.get("/levels", learnToSwimController.getLearnToSwimLevels);
router.post("/levels", learnToSwimController.createLearnToSwimLevel);
router.put("/levels/:id", learnToSwimController.updateLearnToSwimLevel);
router.delete("/levels/:id", learnToSwimController.deleteLearnToSwimLevel);

router.get(
  "/sections/category",
  learnToSwimController.getLearnToSwimSectionCategories
);
router.post(
  "/sections/category",
  learnToSwimController.createLearnToSwimSectionCategory
);
router.put(
  "/sections/category/:id",
  learnToSwimController.updateLearnToSwimSectionCategory
);
router.delete(
  "/sections/category/:id",
  learnToSwimController.deleteLearnToSwimSectionCategory
);

router.post("/sections", learnToSwimController.createLearnToSwimSection);
router.get("/sections", learnToSwimController.getLearnToSwimSections);
router.put("/sections/:id", learnToSwimController.updateLearnToSwimSection);
router.delete("/sections/:id", learnToSwimController.deleteLearnToSwimSection);

module.exports = router;
