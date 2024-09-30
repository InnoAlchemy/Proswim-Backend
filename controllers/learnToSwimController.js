const express = require("express");
const LearnToSwim = require("../models/LearnToSwim");
const router = express.Router();

exports.getLearnToSwimLevels = async (req, res) => {
  try {
    const levels = await LearnToSwim.getAllLevels();
    if (levels.length > 0) {
      const formattedLevels = levels.map((level) => ({
        id: level.id,
        title: level.title,
        markdown_text: level.markdown_text,
        header_image: level.header_image,
        is_active: level.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Learn to Swim levels retrieved successfully.",
        data: formattedLevels,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No levels found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.createLearnToSwimLevel = async (req, res) => {
  try {
    const { id, title, markdown_text, header_image, is_active } = req.body;

    await LearnToSwim.createLevel(
      id,
      title,
      markdown_text,
      header_image,
      is_active
    );

    const newLevel = await LearnToSwim.getLevel(id);
    if (newLevel) {
      const formattedLevel = {
        id: newLevel.id,
        title: newLevel.title,
        markdown_text: newLevel.markdown_text,
        header_image: newLevel.header_image,
        is_active: newLevel.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Learn to Swim level created successfully.",
        data: formattedLevel,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating Learn to Swim level.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateLearnToSwimLevel = async (req, res) => {
  try {
    const { id, title, markdown_text, header_image, is_active } = req.body;

    const updatedLevel = await LearnToSwim.updateLevel(
      id,
      title,
      markdown_text,
      header_image,
      is_active
    );
    if (updatedLevel) {
      const formattedLevel = {
        id: updatedLevel.id,
        title: updatedLevel.title,
        markdown_text: updatedLevel.markdown_text,
        header_image: updatedLevel.header_image,
        is_active: updatedLevel.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Learn to Swim level updated successfully.",
        data: formattedLevel,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating Learn to Swim level.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteLearnToSwimLevel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLevel = await LearnToSwim.deleteLevel(id);
    if (deletedLevel) {
      res.status(200).json({
        success: true,
        message: "Learn to Swim level deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting Learn to Swim level.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getLearnToSwimSectionCategories = async (req, res) => {
  try {
    const categories = await LearnToSwim.getAllSectionCategories();
    if (categories.length > 0) {
      const formattedCategories = categories.map((category) => ({
        id: category.id,
        title: category.title,
        description: category.description,
        is_active: category.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Learn-to-Swim Section Categories retrieved successfully.",
        data: formattedCategories,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No categories found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.createLearnToSwimSectionCategory = async (req, res) => {
  try {
    const { id, title, description, is_active } = req.body;

    const newCategory = await LearnToSwim.createSectionCategory(
      id,
      title,
      description,
      is_active
    );

    await LearnToSwim.getSectionCategory(id);
    if (newCategory) {
      const formattedCategory = {
        id: newCategory.id,
        title: newCategory.title,
        description: newCategory.description,
        is_active: newCategory.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Learn-to-Swim Section Category created successfully.",
        data: formattedCategory,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating Learn-to-Swim Section Category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateLearnToSwimSectionCategory = async (req, res) => {
  try {
    const { id, title, description, is_active } = req.body;

    const updatedCategory = await LearnToSwim.updateSectionCategory(
      id,
      title,
      description,
      is_active
    );
    if (updatedCategory) {
      const formattedCategory = {
        id: updatedCategory.id,
        title: updatedCategory.title,
        description: updatedCategory.description,
        is_active: updatedCategory.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Learn-to-Swim Section Category updated successfully.",
        data: formattedCategory,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating Learn-to-Swim Section Category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteLearnToSwimSectionCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await LearnToSwim.deleteSectionCategory(id);
    if (deletedCategory) {
      res.status(200).json({
        success: true,
        message: "Learn-to-Swim Section Category deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting Learn-to-Swim Section Category.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.createLearnToSwimSection = async (req, res) => {
  try {
    const { level_id, markdown_text, header_image, category_id, is_active } =
      req.body;

    await LearnToSwim.createSection(
      level_id,
      markdown_text,
      header_image,
      category_id,
      is_active
    );

    const newSection = await LearnToSwim.getSection(level_id, category_id);
    if (newSection) {
      const formattedSection = {
        level_id: newSection.level_id,
        markdown_text: newSection.markdown_text,
        header_image: newSection.header_image,
        category_id: newSection.category_id,
        is_active: newSection.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Learn to Swim section created successfully.",
        data: formattedSection,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating Learn to Swim section.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getLearnToSwimSections = async (req, res) => {
  try {
    const sections = await LearnToSwim.getAllSections();
    if (sections.length > 0) {
      const formattedSections = sections.map((section) => ({
        level_id: section.level_id,
        markdown_text: section.markdown_text,
        header_image: section.header_image,
        category_id: section.category_id,
        is_active: section.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Learn to Swim sections retrieved successfully.",
        data: formattedSections,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No sections found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateLearnToSwimSection = async (req, res) => {
  try {
    const { level_id, markdown_text, header_image, category_id, is_active } =
      req.body;

    const updatedSection = await LearnToSwim.updateSection(
      level_id,
      markdown_text,
      header_image,
      category_id,
      is_active
    );
    if (updatedSection) {
      const formattedSection = {
        level_id: updatedSection.level_id,
        markdown_text: updatedSection.markdown_text,
        header_image: updatedSection.header_image,
        category_id: updatedSection.category_id,
        is_active: updatedSection.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Learn to Swim section updated successfully.",
        data: formattedSection,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error updating Learn to Swim section.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteLearnToSwimSection = async (req, res) => {
  try {
    const { level_id } = req.params;

    const deletedSection = await LearnToSwim.deleteSection(level_id);
    if (deletedSection) {
      res.status(200).json({
        success: true,
        message: "Learn to Swim section deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting Learn to Swim section.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getLearnToSwimSectionByLevelId = async (req, res) => {
  try {
    const { level_id } = req.params;
    const sections = await LearnToSwim.getSectionsByLevelId(level_id);
    if (sections.length > 0) {
      const formattedSections = sections.map((section) => ({
        level_id: section.level_id,
        markdown_text: section.markdown_text,
        header_image: section.header_image,
        category_id: section.category_id,
        is_active: section.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "Learn to Swim sections retrieved successfully.",
        data: formattedSections,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No sections found for the given level ID.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
