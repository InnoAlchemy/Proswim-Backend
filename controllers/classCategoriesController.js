const express = require("express");
const ClassCategories = require("../models/ClassCategories");
const router = express.Router();

exports.getClassCategories = async (req, res) => {
  try {
    const classCategories = await ClassCategories.getAllClassCategories();
    if (classCategories.length > 0) {
      const formattedClassCategories = classCategories.map((classCategory) => ({
        id: classCategory.id,
        title: classCategory.title,
        header_image: classCategory.header_image,
        is_active: classCategory.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Class Categories retrieved successfully.",
        data: formattedClassCategories,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Class Categories found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addClassCategory = async (req, res) => {
  try {
    const { id, title, header_image, is_active } = req.body;

    await ClassCategories.createClassCategory(
      id,
      title,
      header_image,
      is_active
    );

    const classCategory = await ClassCategories.getClassCategory(id);
    if (classCategory) {
      const formattedClassCategories = {
        id: classCategory.id,
        title: classCategory.title,
        header_image: classCategory.header_image,
        is_active: classCategory.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Class Category Created Succefully.",
        data: formattedClassCategories,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Class Category creating classCategory.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//
exports.updateClassCategory = async (req, res) => {
  try {
    const { id, title, header_image, is_active } = req.body;
    console.log(req.body);
    const classCategory = await ClassCategories.updateClassCategory(
      id,
      title,
      header_image,
      is_active
    );
    if (classCategory) {
      const formattedClassCategories = {
        id: classCategory.id,
        title: classCategory.title,
        title: classCategory.title,
        is_active: classCategory.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Class Category Updated Succefully.",
        data: formattedClassCategories,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating classCategory.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//

exports.deleteClassCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const classCategory = await ClassCategories.deleteClassCategory(id);
    console.log(classCategory);
    if (classCategory) {
      res.status(200).json({
        success: true,
        message: "Class Category Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting classCategory.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
