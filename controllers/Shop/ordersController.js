const Order = require("../../models/Shop/Order");

exports.createOrder = async (req, res) => {
  try {
    const { products, status, currency } = req.body;
    const user_id = req.userId;
    const parsedProducts =
      typeof products === "string" ? JSON.parse(products) : products;

    const orderData = {
      user_id,
      status,
      currency,
      products: parsedProducts.map((product) => ({
        id: product.id, // Ensure product_id is correctly mapped
        color: product.color,
        gender: product.gender,
        quantity: product.quantity,
        size: product.size,
      })),
    };

    const orderId = await Order.createOrder(orderData);
    const order = await Order.getOrder(orderId);

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: [order],
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
    const id = req.params;
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

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const orders = await Order.getOrdersByUser(userId);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Orders.",
    });
  }
};
