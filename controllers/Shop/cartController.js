const Cart = require("../../models/Shop/Cart");
const Products = require("./productsController");

exports.getCartItems = async (req, res) => {
  try {
    const user_id = req.userId;
    const cartItems = await Cart.getCartItemsByUserId(user_id);
    const products = await Products.getFormattedProducts();
    const modifiedCartItems = cartItems.map((item) => {
      const product = products.formattedProducts.find(
        (p) => p.id === item.product_id
      );
      const { product_id, gender, gender_title, ...rest } = item;
      return {
        ...rest,
        gender: {
          id: gender,
          title: gender_title,
        },
        product: product ? product : null,
      };
    });

    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully.",
      data: modifiedCartItems,
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
    const { product_id, quantity, gender, color, size } = req.body;
    const user_id = req.userId;
    const data = await Cart.addCartItem(
      product_id,
      user_id,
      quantity,
      gender,
      color,
      size
    );
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
    const { product_id, quantity, gender, color, size } = req.body;
    const { id } = req.params;
    const user_id = req.userId;

    const cartItem = await Cart.updateCartItem(
      id,
      quantity,
      gender,
      color,
      size
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
