const express = require("express");
const Payment = require("../../models/Shop/Payment");
const router = express.Router();
exports.createPayment = async (req, res) => {
  try {
    const { product_id, payment_info, amount } = req.body;
    const user_id = req.userId;

    const data = await Payment.createPayment(
      user_id,
      product_id,
      payment_info,
      amount
    );

    if (data) {
      res.status(201).json({
        success: true,
        message: "Payment created successfully.",
        data: [data],
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error creating Payment.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.getPayment(id);
    if (payment) {
      res.status(200).json({
        success: true,
        message: "Payment information retrieved successfully.",
        data: payment,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error retrieving Payment information.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.deletePayment(id);
    if (payment) {
      res.status(200).json({
        success: true,
        message: "Payment deleted successfully.",
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error deleting Payment.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
