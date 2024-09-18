const express = require("express");
const Core = require("../models/Core");
const router = express.Router();

exports.getCores = async (req, res) => {
  try {
    const cores = await Core.getAllcores();
    console.log(cores);
    if (cores.length > 0) {
      const formattedcores = cores.map((core) => ({
        id: core.id,
        image: core.image,
        title: core.title,
        description: core.description,
        is_active: core.is_active,
      }));

      res.status(200).json({
        success: true,
        message: "cores retrieved successfully.",
        data: formattedcores,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No cores found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addCores = async (req, res) => {
  try {
    const { id, image, title, description, is_active } = req.body;

    await Core.createCore(id, image, title, description, is_active);

    const core = await Core.getCore(id);
    if (core) {
      const formattedcores = {
        id: core.id,
        image: core.image,
        title: core.title,
        description: core.description,
        is_active: core.is_active,
      };

      res.status(200).json({
        success: true,
        message: "core Created Succefully.",
        data: formattedcores,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating core.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//
exports.updateCores = async (req, res) => {
  try {
    const { id, image, title, description, is_active } = req.body;
    console.log(req.body);
    const core = await Core.updateCore(
      id,
      image,
      title,
      description,
      is_active
    );
    if (core) {
      const formattedcores = {
        id: core.id,
        image: core.image,
        title: core.title,
        description: core.description,
        is_active: core.is_active,
      };

      res.status(200).json({
        success: true,
        message: "core Updated Succefully.",
        data: formattedcores,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating core.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//

exports.deleteCores = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const core = await Core.deleteCore(id);
    console.log(core);
    if (core) {
      res.status(200).json({
        success: true,
        message: "core Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting core.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
