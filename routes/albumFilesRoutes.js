const express = require("express");
const router = express.Router();
const albumFilesController = require("../controllers/Album Files/albumFilesController");

router.get("/", albumFilesController.getAlbumFiles);
router.post("/", albumFilesController.addAlbumFile);
router.put("/:id", albumFilesController.updateAlbumFile);
router.delete("/:id", albumFilesController.deleteAlbumFile);

module.exports = router;
