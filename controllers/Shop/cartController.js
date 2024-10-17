const Cart = require("../../models/Shop/Cart");

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const cartItems = await Cart.getCartItemsByUserId(userId);
    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully.",
      data: cartItems,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Cart items.",
    });
  }
};

exports.addCartItem = async (req, res) => {
  try {
    const { product_id, user_id, quantity } = req.body;
    const data = await Cart.addCartItem(product_id, user_id, quantity);
    res.status(201).json({
      success: true,
      message: "Product added to cart successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error adding Product to cart.",
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id, product_id, user_id, quantity } = req.body;
    const cartItem = await Cart.updateCartItem(
      id,
      product_id,
      user_id,
      quantity
    );
    res.status(200).json({
      success: true,
      message: "Cart item updated successfully.",
      data: cartItem,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error updating Cart item.",
    });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Cart.deleteCartItem(id);
    res.status(200).json({
      success: true,
      message: "Cart item removed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error removing Cart item.",
    });
  }
};
