const express = require("express");
const router = express.Router();
const Feedback = require("../../models/Feedback");
const { sendEmail } = require("../../helper/emailService");

exports.submitFeedback = async (req, res) => {
  try {
    const { name, subject, body, email, user_id = null } = req.body;
    const feedback = await Feedback.createFeedback({
      name,
      subject,
      body,
      email,
      user_id,
    });

    const text = `Name: ${name}\nSubject: ${subject}\nBody: ${body}\nEmail: ${email}\nUser ID: ${user_id}`;
    await sendEmail(process.env.EMAIL_USER, subject, text);

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
    const { id, user_id } = req.query;
    let feedbacks = await Feedback.getFeedbacks();

    if (id) {
      feedbacks = feedbacks.filter((feedback) => feedback.id == id);
    }

    if (user_id) {
      feedbacks = feedbacks.filter((feedback) => feedback.user_id == user_id);
    }

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

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.deleteFeedback(id);

    if (!feedback) {
      return res.status(404).json({
        error: true,
        message: "Feedback not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting feedback.",
    });
  }
};
