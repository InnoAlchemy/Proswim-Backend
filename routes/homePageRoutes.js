const express = require("express");
const router = express.Router();
const homeController = require("../controllers/Home/homeController");
const homePageController = require("../controllers/Pages/homePageController");

const learnHowtoSwimController = require("../controllers/Home/learnHowtoSwimController");

router.get("/", homePageController.getHomePage);

router.get("/banners", homeController.getBanners);
router.post("/banners", homeController.addBanners);
router.put("/banners/:id", homeController.updateBanners);
router.delete("/banners/:id", homeController.deleteBanners);

//
router.get(
  "/learn-to-swim-button",
  learnHowtoSwimController.getlearnToSwimButtons
);
router.post(
  "/learn-to-swim-button",
  learnHowtoSwimController.addlearnToSwimButtons
);
router.put(
  "/learn-to-swim-button/:id",
  learnHowtoSwimController.updatelearnToSwimButtons
);
router.delete(
  "/learn-to-swim-button/:id",
  learnHowtoSwimController.deletelearnToSwimButtons
);

module.exports = router;
