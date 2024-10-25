const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/About Us/aboutUsController");
const upload = require("../helper/uploadHandler");

router.get("/categories", aboutUsController.getAboutUsCategories);
router.get("/categories/:id", aboutUsController.getAboutUsCategoriesAndInfo);
router.post(
  "/categories",
  upload.single("header_image"),
  aboutUsController.addAboutUsCategory
);
router.put(
  "/categories/:id",
  upload.single("header_image"),
  aboutUsController.updateAboutUsCategory
);
router.delete("/categories/:id", aboutUsController.deleteAboutUsCategory);

router.get("/info", upload.single("image"), aboutUsController.getAboutUsInfo);
router.post("/info", upload.single("image"), aboutUsController.addAboutUsInfo);
router.put(
  "/info/:id",
  upload.single("image"),
  aboutUsController.updateAboutUsInfo
);
router.delete("/info/:id", aboutUsController.deleteAboutUsInfo);

module.exports = router;
