const express = require("express");
const router = express.Router();
const SocialLink = require("../../models/SocialLink"); // Assuming you have a SocialLink model

exports.getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await SocialLink.getSocialLinks();
    res.status(200).json({
      success: true,
      message: "Social links retrieved successfully.",
      data: socialLinks,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving social links.",
    });
  }
};

exports.createSocialLink = async (req, res) => {
  try {
    const { link, is_active } = req.body;
    const icon = req.file ? req.file.filename : null;

    const socialLink = await SocialLink.createSocialLink({
      icon,
      link,
      is_active,
    });
    res.status(201).json({
      success: true,
      message: "Social link created successfully.",
      data: socialLink,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error creating social link.",
    });
  }
};

exports.updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, is_active } = req.body;
    const icon = req.file ? req.file.filename : null;

    const socialLink = await SocialLink.updateSocialLink(id, {
      icon,
      link,
      is_active,
    });
    res.status(200).json({
      success: true,
      message: "Social link updated successfully.",
      data: socialLink,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error updating social link.",
    });
  }
};

exports.deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const socialLink = await SocialLink.deleteSocialLink(id);
    res.status(200).json({
      success: true,
      message: "Social link deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting social link.",
    });
  }
};
