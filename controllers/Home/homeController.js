const express = require("express");
const Banner = require("../../models/Banners");
const router = express.Router();

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.getAllBanners();
    console.log(banners);
    if (banners.length > 0) {
      const formattedBanners = banners.map((banner) => ({
        id: banner.id,
        image: banner.image,
        title: banner.title,
        is_active: banner.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Banners retrieved successfully.",
        data: formattedBanners,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No banners found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addBanners = async (req, res) => {
  try {
    const { id, image, title, is_active } = req.body;

    await Banner.createBanner(id, image, title, is_active);

    const banner = await Banner.getBanner(id);
    if (banner) {
      const formattedBanners = {
        id: banner.id,
        image: banner.image,
        title: banner.title,
        is_active: banner.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Banner Created Succefully.",
        data: formattedBanners,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating banner.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//
exports.updateBanners = async (req, res) => {
  try {
    const { id, image, title, is_active } = req.body;
    console.log(req.body);
    const banner = await Banner.updateBanner(id, image, title, is_active);
    if (banner) {
      const formattedBanners = {
        id: banner.id,
        image: banner.image,
        title: banner.title,
        is_active: banner.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Banner Updated Succefully.",
        data: formattedBanners,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating banner.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//

exports.deleteBanners = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const banner = await Banner.deleteBanner(id);
    console.log(banner);
    if (banner) {
      res.status(200).json({
        success: true,
        message: "Banner Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting banner.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
