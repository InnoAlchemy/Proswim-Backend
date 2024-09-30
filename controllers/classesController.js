const express = require("express");
const Classes = require("../models/Classes");
const router = express.Router();

exports.getClasses = async (req, res) => {
  try {
    const classes = await Classes.getAllClasses();
    if (classes.length > 0) {
      const formattedClasses = classes.map((class_object) => ({
        id: class_object.id,
        class_category_id: class_object.class_category_id,
        markdown_text: class_object.markdown_text,
        is_active: class_object.is_active,
        button_text: class_object.button_text,
      }));

      res.status(200).json({
        success: true,
        message: "Classes retrieved successfully.",
        data: formattedClasses,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Classes found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addClass = async (req, res) => {
  try {
    const { id, class_category_id, markdown_text, is_active, button_text } =
      req.body;

    class_object = await Classes.createClass(
      id,
      class_category_id,
      markdown_text,
      is_active,
      button_text
    );
    console.log(class_object);

    if (class_object) {
      const formattedClasses = {
        id: class_object.id,
        class_category_id: class_object.class_category_id,
        markdown_text: class_object.markdown_text,
        is_active: class_object.is_active,
        button_text: class_object.button_text,
      };

      res.status(200).json({
        success: true,
        message: "Class Created Successfully.",
        data: formattedClasses,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Class creating class_object.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id, class_category_id, markdown_text, is_active, button_text } =
      req.body;
    console.log(req.body);
    const class_object = await Classes.updateClass(
      id,
      class_category_id,
      markdown_text,
      is_active,
      button_text
    );
    if (class_object) {
      const formattedClasses = {
        id: class_object.id,
        class_category_id: class_object.class_category_id,
        markdown_text: class_object.markdown_text,
        is_active: class_object.is_active,
        button_text: class_object.button_text,
      };

      res.status(200).json({
        success: true,
        message: "Class Updated Successfully.",
        data: formattedClasses,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating Class.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const class_object = await Classes.deleteClass(id);
    console.log(class_object);
    if (class_object) {
      res.status(200).json({
        success: true,
        message: "Class Deleted Successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting class",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
