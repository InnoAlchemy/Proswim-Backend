const express = require("express");
const router = express.Router();
const classCatogriesController = require("../controllers/classCategoriesController");

router.get("/", classCatogriesController.getClassCategories);
router.post("/", classCatogriesController.addClassCategory);
router.put("/:id", classCatogriesController.updateClassCategory);
router.delete("/:id", classCatogriesController.deleteClassCategory);

module.exports = router;
