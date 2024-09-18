const express = require("express");
const LearnToSwim = require("../models/Buttons");
const router = express.Router();

exports.getlearnToSwimButtons = async (req, res) => {
  try {
    const buttons = await LearnToSwim.getAllButtons();
    console.log(buttons);
    if (buttons.length > 0) {
      const formattedButtons = buttons.map((button) => ({
        id: button.id,
        image: button.image,
        page_link: button.page_link,
        is_active: button.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "buttons retrieved successfully.",
        data: formattedButtons,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No buttons found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addlearnToSwimButtons = async (req, res) => {
  try {
    const { id, image, page_link, is_active } = req.body;

    await LearnToSwim.createButton(id, image, page_link, is_active);

    const button = await LearnToSwim.getButton(id);
    if (button) {
      const formattedButtons = {
        id: button.id,
        image: button.image,
        page_link: button.page_link,
        is_active: button.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Button Created Succefully.",
        data: formattedButtons,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Button creating button.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//
exports.updatelearnToSwimButtons = async (req, res) => {
  try {
    const { id, image, page_link, is_active } = req.body;
    console.log(req.body);
    const button = await LearnToSwim.updateButton(
      id,
      image,
      page_link,
      is_active
    );
    if (button) {
      const formattedButtons = {
        id: button.id,
        image: button.image,
        title: button.title,
        is_active: button.is_active,
      };

      res.status(200).json({
        success: true,
        message: "Button Updated Succefully.",
        data: formattedButtons,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating button.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//

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
