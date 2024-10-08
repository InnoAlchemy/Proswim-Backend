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
        success: true,
        message: "Banners retrieved successfully.",
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
    const { title, is_active } = req.body;
    const image = req.file ? req.file.filename : null;
    const data = await Banner.createBanner(image, title, is_active);
    res.status(200).json({
      success: true,
      message: "Banner created successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error); // Log any unexpected errors
    res.status(500).json({
      success: false,
      message: "Error creating banner.",
    });
  }
};

//
exports.updateBanners = async (req, res) => {
  try {
    const { title, is_active } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.filename : null;
    const bannerData = { image, title, is_active };
    const banner = await Banner.updateBanner(id, bannerData);

    if (banner) {
      const formattedBanner = {
        id: banner.id,
        image: banner.image,
        title: banner.title,
        is_active: banner.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Banner updated successfully.",
        data: formattedBanner,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating banner.",
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
