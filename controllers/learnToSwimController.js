const express = require("express");
const LearnToSwim = require("../models/LearnToSwim");
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
    const { title, markdown_text, header_image, is_active } = req.body;
    const newLevel = await LearnToSwim.createLevel(
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
    const {
      id,
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active,
    } = req.body;

    const newSection = await LearnToSwim.createSection(
      id,
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
