const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/About Us/aboutUsController");

router.get("/categories", aboutUsController.getAboutUsCategories);
router.post("/categories", aboutUsController.addAboutUsCategory);
router.put("/categories/:id", aboutUsController.updateAboutUsCategory);
router.delete("/categories/:id", aboutUsController.deleteAboutUsCategory);

router.get("/info", aboutUsController.getAboutUsInfo);
router.post("/info", aboutUsController.addAboutUsInfo);
router.put("/info/:id", aboutUsController.updateAboutUsInfo);
router.delete("/info/:id", aboutUsController.deleteAboutUsInfo);

module.exports = router;
