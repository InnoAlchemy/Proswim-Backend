const Order = require("../../models/Shop/Order");
const Products = require("./productsController");

exports.createOrder = async (req, res) => {
  try {
    const { products, status, currency, address } = req.body;
    const user_id = req.userId;
    const parsedProducts =
      typeof products === "string" ? JSON.parse(products) : products;

    const orderData = {
      user_id,
      status,
      address,
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
    const orders = await Order.getAllOrders();
    const products = await Products.getFormattedProducts();

    const modifiedOrders = orders.map((order) => {
      const modifiedProducts = order.products.map((item) => {
        const product = products.formattedProducts.find(
          (p) => p.id === item.id
        );
        return {
          ...item,
          product_information: product ? product : null,
        };
      });
      return {
        ...order,
        products: modifiedProducts,
      };
    });

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully.",
      data: modifiedOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving all orders.",
    });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    let orders = await Order.getAllOrders();
    const products = await Products.getFormattedProducts();

    if (user_id) {
      orders = orders.filter((order) => order.user_id === user_id);
    }

    const modifiedOrders = orders.map((order) => {
      const modifiedProducts = order.products.map((item) => {
        const product = products.formattedProducts.find(
          (p) => p.id == item.product_id
        );
        console.log(products);
        return {
          ...item,
          product_information: product || null, // Return product or null if not found
        };
      });
      return {
        ...order,
        products: modifiedProducts,
      };
    });

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully.",
      data: modifiedOrders,
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
    const products = await Products.getFormattedProducts();

    if (id) {
      orders = orders.filter((order) => order.order_id == id);
    }

    const modifiedOrders = orders.map((order) => {
      const modifiedProducts = order.products.map((item) => {
        const product = products.formattedProducts.find(
          (p) => p.id === item.id
        );
        return {
          ...item,
          product_information: product ? product : null,
        };
      });
      return {
        ...order,
        products: modifiedProducts,
      };
    });

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      data: modifiedOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Order details.",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { products, status, currency, address } = req.body;
    const parsedProducts =
      typeof products === "string" ? JSON.parse(products) : products;

    const orderData = {
      status,
      address,
      currency,
      products: parsedProducts.map((product) => ({
        id: product.id,
        color: product.color,
        gender: product.gender,
        quantity: product.quantity,
        size: product.size,
      })),
    };

    await Order.updateOrder(id, orderData);
    const updatedOrder = await Order.getOrder(id);

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: [updatedOrder],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error updating Order.",
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
