const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

router.get("/", locationsController.getLocations);
router.post("/", locationsController.addLocations);
router.put("/:id", locationsController.updateLocations);
router.delete("/:id", locationsController.deleteLocations);

module.exports = router;
