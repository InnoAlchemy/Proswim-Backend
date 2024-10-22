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

exports.getAllOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    let orders = await Order.getAllOrders();

    if (user_id) {
      orders = orders.filter((order) => order.user_id === user_id);
    }

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving all orders.",
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.query;
    let orders = await Order.getAllOrders();

    if (id) {
      orders = orders.filter((order) => order.order_id == id);
    }

    res.status(200).json({
      success: true,
      message: "orders retrieved successfully.",
      data: orders,
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
