const express = require("express");
const ClassCategories = require("../../models/ClassCategories");
const router = express.Router();

exports.getClassCategories = async (req, res) => {
  try {
    const classCategories = await ClassCategories.getAllCategories();
    if (classCategories.length > 0) {
      const formattedClassCategories = classCategories.map((classCategory) => ({
        id: classCategory.id,
        title: classCategory.title,
        description: classCategory.description,
        header_image: classCategory.header_image,
        is_active: classCategory.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Class categories retrieved successfully.",
        data: formattedClassCategories,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No class categories found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Error retrieving class categories." });
  }
};

exports.addClassCategory = async (req, res) => {
  try {
    const { title, description, is_active } = req.body;
    const header_image = req.file ? req.file.filename : null;

    if (!header_image) {
      return res.status(400).json({
        success: false,
        message: "Header image file is required.",
      });
    }

    const host = req.protocol + "://" + req.get("host");
    const data = await ClassCategories.createCategory(
      title,
      description,
      `${host}/uploads/${header_image}`,
      is_active
    );

    res.status(201).json({
      success: true,
      message: "Class category created successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error creating class category.",
    });
  }
};

exports.updateClassCategory = async (req, res) => {
  try {
    const { id, title, description, is_active } = req.body;
    const header_image = req.file ? req.file.filename : null;

    const classCategoryData = { title, description, header_image, is_active };

    const classCategory = await ClassCategories.updateCategory(
      id,
      classCategoryData
    );
    if (classCategory) {
      const formattedClassCategory = {
        id: classCategory.id,
        title: classCategory.title,
        description: classCategory.description,
        header_image: classCategory.header_image,
        is_active: classCategory.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Class category updated successfully.",
        data: formattedClassCategory,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating class category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error updating class category.",
    });
  }
};
exports.deleteClassCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const classCategory = await ClassCategories.deleteCategory(id);
    console.log(classCategory);
    if (classCategory) {
      res.status(200).json({
        success: true,
        message: "Class category deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting class category.",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Error deleting class category." });
  }
};
