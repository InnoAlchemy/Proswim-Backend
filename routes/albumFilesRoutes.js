const express = require("express");
const router = express.Router();
const albumFilesController = require("../controllers/Album Files/albumFilesController");
const upload = require("../helper/uploadHandler");

router.get("/", albumFilesController.getAlbumFiles);
router.post("/", upload.array("files"), albumFilesController.addAlbumFile);
router.put("/:id", upload.array("files"), albumFilesController.updateAlbumFile);
router.delete("/:id", albumFilesController.deleteAlbumFile);

module.exports = router;
