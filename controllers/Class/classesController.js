const express = require("express");
const Classes = require("../../models/Classes");
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
        list_of_content: class_object.list_of_content || [],
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
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const {
      class_category_id,
      markdown_text,
      is_active,
      button_text,
      list_of_content,
    } = req.body;

    const parsedContentList = list_of_content.map((content) =>
      typeof content === "string" ? JSON.parse(content) : content
    );

    if (parsedContentList && Array.isArray(parsedContentList)) {
      parsedContentList.forEach((content, index) => {
        const imageFieldName = `list_of_content[${index}]`;
        const imageFile = req.files
          ? req.files.find((image) => image.fieldname === imageFieldName)
          : null;
        content.image = imageFile ? imageFile.filename : null;
      });
    }

    const data = await Classes.createClass(
      class_category_id,
      markdown_text,
      is_active,
      button_text,
      parsedContentList
    );
    res.status(200).json({
      success: true,
      message: "Class Created Successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      error: true,
      message: "Error creating class category.",
    });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => file.filename) : [];
    const { id } = req.params;

    const {
      class_category_id,
      markdown_text,
      is_active,
      button_text,
      list_of_content,
    } = req.body;

    const parsedContentList = list_of_content.map((content) =>
      typeof content === "string" ? JSON.parse(content) : content
    );

    if (parsedContentList && Array.isArray(parsedContentList)) {
      parsedContentList.forEach((content, index) => {
        const imageFieldName = `list_of_content[${index}]`;
        const imageFile = req.files
          ? req.files.find((image) => image.fieldname === imageFieldName)
          : null;
        content.image = imageFile ? imageFile.filename : null;
      });
    }

    const class_object = await Classes.updateClass(
      id,
      class_category_id,
      markdown_text,
      is_active,
      button_text,
      parsedContentList
    );

    const updatedClass = await Classes.getClass(id);

    res.status(200).json({
      success: true,
      message: "Class Updated Successfully.",
      data: updatedClass,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const id = req.params.id;
    const class_object = await Classes.deleteClass(id);
    if (class_object) {
      res.status(200).json({
        success: true,
        message: "Class Deleted Successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting class.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
