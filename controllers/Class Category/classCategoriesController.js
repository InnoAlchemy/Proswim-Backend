const express = require("express");
const ClassCategories = require("../../models/ClassCategories");
const Classes = require("../../models/Classes");

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

    const data = await ClassCategories.createCategory(
      title,
      description,
      header_image,
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
    const { title, description, is_active } = req.body;
    const { id } = req.params;
    const header_image = req.file ? req.file.filename : null;

    const updatedCategory = await ClassCategories.updateCategory(
      id,
      title,
      description,
      header_image,
      is_active
    );

    if (updatedCategory) {
      const formattedClassCategory = {
        id: updatedCategory.id,
        title: updatedCategory.title,
        description: updatedCategory.description,
        header_image: updatedCategory.header_image,
        is_active: updatedCategory.is_active,
      };

      return res.status(200).json({
        success: true,
        message: "Class category updated successfully.",
        data: formattedClassCategory,
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "Class category not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while updating the class category.",
    });
  }
};
exports.deleteClassCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const classCategory = await ClassCategories.deleteCategory(id);
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

exports.getClassCategoriesWithClasses = async (req, res) => {
  try {
    const classCategories = await ClassCategories.getAllCategories();
    const classes = await Classes.getAllClasses();
    const formattedClassCategories = classCategories.map((category) => {
      return {
        ...category,
        classes: classes.filter(
          (class_object) => class_object.class_category_id == category.id
        ),
      };
    });

    res.status(200).json({
      success: true,
      message:
        "Class categories with associated classes retrieved successfully.",
      data: formattedClassCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving class categories and classes.",
    });
  }
};
