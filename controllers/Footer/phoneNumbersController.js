const express = require("express");
const PhoneNumbers = require("../../models/PhoneNumbers"); // Assuming you have a PhoneNumbers model
const router = express.Router();

exports.getPhoneNumbers = async (req, res) => {
  try {
    const phoneNumbers = await PhoneNumbers.getAllPhoneNumbers();
    if (phoneNumbers.length > 0) {
      res.status(200).json({
        success: true,
        message: "Phone numbers retrieved successfully.",
        data: phoneNumbers,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No phone numbers found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Error retrieving phone numbers." });
  }
};

exports.createPhoneNumber = async (req, res) => {
  try {
    const { phone_number, is_active } = req.body;
    const phoneNumber = await PhoneNumbers.createPhoneNumber(
      phone_number,
      is_active
    );
    res.status(201).json({
      success: true,
      message: "Phone number created successfully.",
      data: phoneNumber,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Error creating phone number." });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone_number, is_active } = req.body;
    const phoneNumber = await PhoneNumbers.updatePhoneNumber(
      id,
      phone_number,
      is_active
    );
    res.status(200).json({
      success: true,
      message: "Phone number updated successfully.",
      data: phoneNumber,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Error updating phone number." });
  }
};

exports.deletePhoneNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const phoneNumber = await PhoneNumbers.deletePhoneNumber(id);
    if (phoneNumber) {
      res.status(200).json({
        success: true,
        message: "Phone number deleted successfully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting phone number.",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Error deleting phone number." });
  }
};
