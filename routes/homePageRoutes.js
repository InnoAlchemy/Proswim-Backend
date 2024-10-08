const express = require("express");
const router = express.Router();
const homeController = require("../controllers/Home/homeController");
const homePageController = require("../controllers/Pages/homePageController");

const learnHowtoSwimController = require("../controllers/Home/learnHowtoSwimController");

const coreValuesController = require("../controllers/Home/coreValuesController");

const upload = require("../helper/uploadHandler");

router.get("/", homePageController.getHomePage);

router.get("/banners", homeController.getBanners);
router.post("/banners", upload.single("image"), homeController.addBanners);
router.put(
  "/banners/:id",
  upload.single("image"),
  homeController.updateBanners
);
router.delete("/banners/:id", homeController.deleteBanners);

router.get("/core-values", coreValuesController.getCores);
router.post(
  "/core-values",
  upload.single("image"),
  coreValuesController.addCores
);
router.put(
  "/core-values/:id",
  upload.single("image"),
  coreValuesController.updateCores
);
router.delete("/core-values/:id", coreValuesController.deleteCores);

//
router.get(
  "/learn-to-swim-button",
  learnHowtoSwimController.getlearnToSwimButtons
);
router.post(
  "/learn-to-swim-button",
  upload.single("image"),
  learnHowtoSwimController.addlearnToSwimButtons
);
router.put(
  "/learn-to-swim-button/:id",
  upload.single("image"),
  learnHowtoSwimController.updatelearnToSwimButtons
);
router.delete(
  "/learn-to-swim-button/:id",
  learnHowtoSwimController.deletelearnToSwimButtons
);

module.exports = router;
