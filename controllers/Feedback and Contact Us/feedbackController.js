const express = require("express");
const router = express.Router();
const Feedback = require("../../models/Feedback"); // Assuming you have a Feedback model

exports.submitFeedback = async (req, res) => {
  try {
    const { user_id, subject, body, email } = req.body;
    const feedback = await Feedback.createFeedback({
      user_id,
      subject,
      body,
      email,
    });
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error submitting feedback.",
    });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.getFeedbacks();
    res.status(200).json({
      success: true,
      message: "Feedback submissions retrieved successfully.",
      data: feedbacks,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving feedback submissions.",
    });
  }
};
