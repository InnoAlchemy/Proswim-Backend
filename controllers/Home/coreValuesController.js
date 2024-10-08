const express = require("express");
const Core = require("../../models/Core");
const router = express.Router();

exports.getCores = async (req, res) => {
  try {
    const cores = await Core.getAllcores();
    const formattedcores = cores.map((core) => ({
      id: core.id,
      image: core.image,
      title: core.title,
      description: core.description,
      is_active: core.is_active,
    }));

    res.status(200).json({
      success: true,
      message: "Core values retrieved successfully.",
      data: formattedcores,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error retrieving core values.",
    });
  }
};

exports.addCores = async (req, res) => {
  try {
    const { title, description, is_active } = req.body;
    const image = req.file ? req.file.filename : null;

    const data = await Core.createCore(image, title, description, is_active);

    res.status(200).json({
      success: true,
      message: "core Created Succefully.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: true,
      message: "Error creating core.",
    });
  }
};

//
exports.updateCores = async (req, res) => {
  try {
    const { title, description, is_active } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.filename : null;

    const core = await Core.updateCore(
      id,
      image,
      title,
      description,
      is_active
    );
    const formattedCore = {
      id: core.id,
      image: core.image,
      title: core.title,
      description: core.description,
      is_active: core.is_active,
    };

    res.status(200).json({
      success: true,
      message: "Core value updated successfully.",
      data: formattedCore,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error updating core value.",
    });
  }
};

exports.deleteCores = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const core = await Core.deleteCore(id);
    console.log(core);
    res.status(200).json({
      success: true,
      message: "core Deleted Succefully.",
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error deleting core.",
    });
  }
};
