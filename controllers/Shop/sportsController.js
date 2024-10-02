const express = require("express");
const Sport = require("../../models/Shop/Sport");
const router = express.Router();

exports.getSports = async (req, res) => {
  try {
    const sports = await Sport.getAllSports();
    if (sports.length > 0) {
      res.status(200).json({
        success: true,
        message: "Sports retrieved successfully.",
        data: sports,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No sports found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addSport = async (req, res) => {
  try {
    const { id, title, is_active } = req.body;

    await Sport.createSport(id, title, is_active);

    const sport = await Sport.getSport(id);
    if (sport) {
      res.status(201).json({
        success: true,
        message: "Sport created successfully.",
        data: sport,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error creating sport.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateSport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_active } = req.body;

    const sport = await Sport.updateSport(id, title, is_active);
    if (sport) {
      res.status(200).json({
        success: true,
        message: "Sport updated successfully.",
        data: sport,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error updating sport.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteSport = async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await Sport.deleteSport(id);
    if (sport) {
      res.status(200).json({
        success: true,
        message: "Sport deleted successfully.",
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error deleting sport.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
