const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/Location/locationsController");
const upload = require("../helper/uploadHandler");

router.get("/", locationsController.getLocations);
router.post("/", upload.single("image"), locationsController.addLocations);
router.put("/:id", upload.single("image"), locationsController.updateLocations);
router.delete("/:id", locationsController.deleteLocations);

module.exports = router;
