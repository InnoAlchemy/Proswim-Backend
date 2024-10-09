const express = require("express");
const router = express.Router();
const classCatogriesController = require("../controllers/Class Category/classCategoriesController");
const upload = require("../helper/uploadHandler");

router.get("/", classCatogriesController.getClassCategories);
router.post(
  "/",
  upload.single("header_image"),
  classCatogriesController.addClassCategory
);
router.put(
  "/:id",
  upload.single("header_image"),
  classCatogriesController.updateClassCategory
);
router.delete("/:id", classCatogriesController.deleteClassCategory);

module.exports = router;
