const express = require("express");
const LearnToSwim = require("../../models/Buttons");
const router = express.Router();

exports.getlearnToSwimButtons = async (req, res) => {
  try {
    const buttons = await LearnToSwim.getAllButtons();
    const formattedButtons = buttons.map((button) => ({
      id: button.id,
      image: button.image,
      page_link: button.page_link,
      is_active: button.is_active,
    }));

    res.status(200).json({
      success: true,
      message: "Learn to Swim button retrieved successfully.",
      data: formattedButtons,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error retrieving Learn to Swim button.",
    });
  }
};

exports.addlearnToSwimButtons = async (req, res) => {
  try {
    const { page_link, is_active } = req.body;
    const image = req.file ? req.file.filename : null;

    const data = await LearnToSwim.createButton(image, page_link, is_active);

    res.status(200).json({
      success: true,
      message: "Learn to Swim button created successfully.",
      data: [data],
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error creating Learn to Swim button.",
    });
  }
};
exports.updatelearnToSwimButtons = async (req, res) => {
  try {
    const { page_link, is_active } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.filename : null;

    const button = await LearnToSwim.updateButton(
      id,
      image,
      page_link,
      is_active
    );

    res.status(200).json({
      success: true,
      message: "Learn to Swim button updated successfully.",
      data: {
        id: button.id,
        image: button.image,
        page_link: button.page_link,
        is_active: button.is_active,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      error: true,
      message: "Error updating Learn to Swim button.",
    });
  }
};

exports.deletelearnToSwimButtons = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const button = await LearnToSwim.deleteButton(id);
    console.log(button);
    if (button) {
      res.status(200).json({
        success: true,
        message: "Button Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting button.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
