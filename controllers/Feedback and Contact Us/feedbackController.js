const express = require("express");
const router = express.Router();
const Feedback = require("../../models/Feedback");
const { sendEmail } = require("../../helper/emailService");

exports.submitFeedback = async (req, res) => {
  try {
    const { user_id, subject, body, email } = req.body;
    const feedback = await Feedback.createFeedback({
      user_id,
      subject,
      body,
      email,
    });

    const text = `User ID: ${user_id}\nSubject: ${subject}\nBody: ${body}\nEmail: ${email}`;
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
