const express = require("express");
const router = express.Router();
const Description = require("../../models/Description"); // Assuming you have a Description model

exports.getDescription = async (req, res) => {
  try {
    const description = await Description.getDescription();
    if (description) {
      res.status(200).json({
        success: true,
        message: "Description retrieved successfully.",
        data: description,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "No description found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error retrieving description.",
    });
  }
};

exports.createDescription = async (req, res) => {
  try {
    const { text } = req.body;
    const description = await Description.createDescription(text);
    res.status(201).json({
      success: true,
      message: "Description created successfully.",
      data: description,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error creating description.",
    });
  }
};

exports.updateDescription = async (req, res) => {
  try {
    const { text } = req.body;
    const description = await Description.updateDescription(text);
    res.status(200).json({
      success: true,
      message: "Description updated successfully.",
      data: description,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error updating description.",
    });
  }
};

exports.deleteDescription = async (req, res) => {
  try {
    const description = await Description.deleteDescription();
    if (description) {
      res.status(200).json({
        success: true,
        message: "Description deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting description.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error deleting description.",
    });
  }
};
