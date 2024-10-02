const express = require("express");
const LearnToSwim = require("../models/LearnToSwim");
const router = express.Router();

// GET /learn-to-swim/levels
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

// POST /learn-to-swim/levels
exports.addLearnToSwimLevel = async (req, res) => {
  try {
    const { id, title, markdown_text, header_image, is_active } = req.body;
    const newLevel = await LearnToSwim.createLevel(
      id,
      title,
      markdown_text,
      header_image,
      is_active
    );
    res.status(201).json({
      success: true,
      message: "Learn to Swim level created successfully.",
      data: newLevel,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error creating Learn to Swim level.",
    });
  }
};

// PUT /learn-to-swim/levels/:id
exports.updateLearnToSwimLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, markdown_text, header_image, is_active } = req.body;
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
    res.status(400).json({
      error: true,
      message: "Error updating Learn to Swim level.",
    });
  }
};

// DELETE /learn-to-swim/levels/:id
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

// POST /learn-to-swim/sections
exports.addLearnToSwimSection = async (req, res) => {
  try {
    const {
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active,
    } = req.body;
    const newSection = await LearnToSwim.createSection(
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active
    );
    res.status(201).json({
      success: true,
      message: "Learn to Swim section created successfully.",
      data: newSection,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error creating Learn to Swim section.",
    });
  }
};

// GET /learn-to-swim/sections
exports.getLearnToSwimSections = async (req, res) => {
  try {
    const sections = await LearnToSwim.getAllSections();

    res.status(200).json({
      success: true,
      message: "Learn to Swim sections retrieved successfully.",
      data: sections.map((section) => ({
        level_id: section.level_id,
        title: section.title,
        markdown_text: section.markdown_text,
        // Parse the JSON string to an object if necessary
        list_of_content: JSON.parse(section.list_of_content), // Ensure this is an array
        header_image: section.header_image,
        is_active: section.is_active,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error retrieving Learn to Swim sections.",
      error: error.message,
    });
  }
};

// PUT /learn-to-swim/sections/:id
exports.updateLearnToSwimSection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active,
    } = req.body;
    const updatedSection = await LearnToSwim.updateSection(
      id,
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active
    );
    res.status(200).json({
      success: true,
      message: "Learn to Swim section updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: "Error updating Learn to Swim section.",
    });
  }
};

// DELETE /learn-to-swim/sections/:id
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
