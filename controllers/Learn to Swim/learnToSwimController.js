const express = require("express");
const LearnToSwim = require("../../models/LearnToSwim");
const router = express.Router();

exports.getLearnToSwimLevels = async (req, res) => {
  try {
    const levels = await LearnToSwim.getAllLevels();
    res.status(200).json({
      success: true,
      message: "Learn to Swim levels retrieved successfully.",
      data: levels,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Learn to Swim levels.",
    });
  }
};

exports.addLearnToSwimLevel = async (req, res) => {
  try {
    const { title, markdown_text, is_active } = req.body;
    const header_image = req.file ? req.file.filename : null;

    const newLevel = await LearnToSwim.createLevel(
      title,
      markdown_text,
      header_image,
      is_active
    );

    res.status(201).json({
      success: true,
      message: "Learn to Swim level created successfully.",
      data: [newLevel],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating Learn to Swim level.",
    });
  }
};

exports.updateLearnToSwimLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, markdown_text, is_active } = req.body;
    const header_image = req.file ? req.file.filename : null;
    const updatedLevel = await LearnToSwim.updateLevel(
      id,
      title,
      markdown_text,
      header_image,
      is_active
    );

    res.status(200).json({
      success: true,
      message: "Learn to Swim level updated successfully.",
      data: updatedLevel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating Learn to Swim level.",
    });
  }
};

exports.deleteLearnToSwimLevel = async (req, res) => {
  try {
    const { id } = req.params;
    await LearnToSwim.deleteLevel(id);
    res.status(200).json({
      success: true,
      message: "Learn to Swim level deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Learn to Swim level.",
    });
  }
};

exports.getLearnToSwimSections = async (req, res) => {
  try {
    const sections = await LearnToSwim.getLearnToSwimSections();
    res.status(200).json({
      success: true,
      message: "Learn to Swim sections retrieved successfully.",
      data: sections,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Learn to Swim sections.",
    });
  }
};

exports.addLearnToSwimSection = async (req, res) => {
  try {
    console.log(req.files);
    const { level_id, title, markdown_text, list_of_content, is_active } =
      req.body;

    const header_image = req.files
      ? req.files.find((image) => image.fieldname === "header_image")
      : null;
    const header_image_name = header_image ? header_image.filename : null;

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

    const newSection = await LearnToSwim.createSection(
      level_id,
      title,
      markdown_text,
      parsedContentList,
      header_image_name,
      is_active
    );

    res.status(201).json({
      success: true,
      message: "Learn to Swim section created successfully.",
      data: newSection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating Learn to Swim section. Please try again later.",
    });
  }
};

exports.updateLearnToSwimSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { level_id, title, markdown_text, list_of_content, is_active } =
      req.body;

    const header_image = req.files
      ? req.files.find((image) => image.fieldname === "header_image")
      : null;
    const header_image_name = header_image ? header_image.filename : null;

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

    const updatedSection = await LearnToSwim.updateSection(
      id,
      level_id,
      title,
      markdown_text,
      parsedContentList,
      header_image_name,
      is_active
    );

    res.status(200).json({
      success: true,
      message: "Learn to Swim section updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating Learn to Swim section.",
    });
  }
};

exports.deleteLearnToSwimSection = async (req, res) => {
  try {
    const { id } = req.params;
    await LearnToSwim.deleteSection(id);
    res.status(200).json({
      success: true,
      message: "Learn to Swim section deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Learn to Swim section.",
    });
  }
};

exports.getLearnToSwimLevelsWithSections = async (req, res) => {
  try {
    const levels = await LearnToSwim.getAllLevels();

    const sections = await LearnToSwim.getLearnToSwimSections();
    const levelsWithSections = levels.map((level) => {
      return {
        ...level,
        sections: sections.filter((section) => section.level_id == level.id),
      };
    });

    res.status(200).json({
      success: true,
      message: "Learn to Swim levels with sections retrieved successfully.",
      data: levelsWithSections,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving Learn to Swim levels and sections.",
    });
  }
};
