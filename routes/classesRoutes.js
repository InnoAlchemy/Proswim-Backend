const express = require("express");
const router = express.Router();
const classesController = require("../controllers/Class/classesController");
const upload = require("../helper/uploadHandler");

router.get("/", classesController.getClasses);
router.post("/", upload.array("image"), classesController.addClass);
router.put("/:id", upload.array("image"), classesController.updateClass);
router.delete("/:id", classesController.deleteClass);

module.exports = router;
