const express = require("express");
const router = express.Router();
const Feedback = require("../../models/Feedback");
const { sendEmail } = require("../../helper/emailService");

exports.submitFeedback = async (req, res) => {
  try {
    const { name, subject, body, email } = req.body;
    const feedback = await Feedback.createFeedback({
      name,
      subject,
      body,
      email,
    });

    const text = `User ID: ${name}\nSubject: ${subject}\nBody: ${body}\nEmail: ${email}`;
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
    const { id } = req.query;
    let feedbacks = await Feedback.getFeedbacks();

    if (id) {
      feedbacks = feedbacks.filter((feedback) => feedback.id == id);
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
