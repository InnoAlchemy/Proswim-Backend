const express = require("express");
const router = express.Router();
const classCatogriesController = require("../controllers/Class Category/classCategoriesController");

router.get("/", classCatogriesController.getClassCategoriesWithClasses);

module.exports = router;
