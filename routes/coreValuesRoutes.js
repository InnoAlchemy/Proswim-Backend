const express = require("express");
const router = express.Router();
const coreValuesController = require("../controllers/Home/coreValuesController");

router.get("/", coreValuesController.getCores);
router.post("/", coreValuesController.addCores);
router.put("/:id", coreValuesController.updateCores);
router.delete("/:id", coreValuesController.deleteCores);

module.exports = router;
