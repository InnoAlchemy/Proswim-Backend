const express = require("express");
const AboutUs = require("../../models/AboutUs");
const router = express.Router();

exports.getAboutUsCategories = async (req, res) => {
  try {
    const categories = await AboutUs.getAllCategories();
    if (categories.length > 0) {
      const formattedCategories = categories.map((category) => ({
        id: category.id,
        title: category.title,
        markdown_text: category.markdown_text,
        header_image: category.header_image,
        is_active: category.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "About Us categories retrieved successfully.",
        data: formattedCategories,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No About Us categories found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addAboutUsCategory = async (req, res) => {
  try {
    const { title, markdown_text, is_active } = req.body;
    const header_image = req.file ? req.file.filename : null;

    const id = await AboutUs.createCategory(
      title,
      markdown_text,
      header_image,
      is_active
    );

    const category = await AboutUs.getCategory(id);
    if (category) {
      const formattedCategory = {
        title: category.title,
        markdown_text: category.markdown_text,
        header_image: category.header_image,
        is_active: category.is_active,
      };

      res.status(200).json({
        success: true,
        message: "About Us category created successfully.",
        data: formattedCategory,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating About Us category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateAboutUsCategory = async (req, res) => {
  try {
    const { id, title, markdown_text, is_active } = req.body;
    const header_image = req.file ? req.file.filename : null;

    const category = await AboutUs.updateCategory(
      id,
      title,
      markdown_text,
      header_image,
      is_active
    );
    if (category) {
      const formattedCategory = {
        id: category.id,
        title: category.title,
        markdown_text: category.markdown_text,
        header_image: category.header_image,
        is_active: category.is_active,
      };

      res.status(200).json({
        success: true,
        message: "About Us category updated successfully.",
        data: formattedCategory,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating About Us category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteAboutUsCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const category = await AboutUs.deleteCategory(id);
    console.log(category);
    if (category) {
      res.status(200).json({
        success: true,
        message: "About Us category deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting About Us category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
exports.getAboutUsInfo = async (req, res) => {
  try {
    const info = await AboutUs.getAllInfo();
    if (info.length > 0) {
      const formattedInfo = info.map((item) => ({
        id: item.id,
        category_id: item.category_id,
        markdown_text: item.markdown_text,
        image: item.image,
        type: item.type,
      }));

      res.status(200).json({
        success: true,
        message: "About Us info retrieved successfully.",
        data: formattedInfo,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No About Us info found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addAboutUsInfo = async (req, res) => {
  try {
    const { category_id, markdown_text, type } = req.body;
    const image = req.file ? req.file.filename : null;

    const data = await AboutUs.createInfo(
      category_id,
      markdown_text,
      image,
      type
    );

    res.status(200).json({
      success: true,
      message: "About Us info created successfully.",
      data: [data],
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error creating About Us info.",
    });
  }
};

exports.updateAboutUsInfo = async (req, res) => {
  try {
    const { id, category_id, markdown_text, type } = req.body;
    const image = req.file ? req.file.filename : null;
    const info = await AboutUs.updateInfo(
      id,
      category_id,
      markdown_text,
      image,
      type
    );
    if (info) {
      const formattedInfo = {
        id: info.id,
        category_id: info.category_id,
        markdown_text: info.markdown_text,
        image: info.image,
        type: info.type,
      };

      res.status(200).json({
        success: true,
        message: "About Us info updated successfully.",
        data: formattedInfo,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating About Us info.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteAboutUsInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const info = await AboutUs.deleteInfo(id);
    if (info) {
      res.status(200).json({
        success: true,
        message: "About Us info deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting About Us info.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
