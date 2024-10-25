const express = require("express");
const router = express.Router();
const albumsController = require("../controllers/Albums/albumsController");

router.get("/", albumsController.getAlbums);
router.get("/:id", albumsController.getAlbumsAndFiles);
router.post("/", albumsController.addAlbums);
router.put("/:id", albumsController.updateAlbums);
router.delete("/:id", albumsController.deleteAlbums);

module.exports = router;
