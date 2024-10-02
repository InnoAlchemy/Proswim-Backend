const Order = require("../../models/Shop/Order");

exports.createOrder = async (req, res) => {
  try {
    const {
      id,
      user_id,
      product_id,
      quantity,
      total_price,
      status,
      created_at,
    } = req.body;
    await Order.createOrder(
      id,
      user_id,
      product_id,
      quantity,
      total_price,
      status,
      created_at
    );
    const order = await Order.getOrder(id);
    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error creating Order.",
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.getOrder(id);
    res.status(200).json({
      success: true,
      message: "Order details retrieved successfully.",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Order details.",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await Order.deleteOrder(id);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Order.",
    });
  }
};
