const express = require("express");
const router = express.Router();
const classesController = require("../controllers/Class/classesController");

router.get("/", classesController.getClasses);
router.post("/", classesController.addClass);
router.put("/:id", classesController.updateClass);
router.delete("/:id", classesController.deleteClass);

module.exports = router;
