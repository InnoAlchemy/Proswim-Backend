const db = require("../../config/db");

class Cart {
  static async getCartItemsByUserId(userId) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM cart_items WHERE user_id = ?",
        [userId]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async addCartItem(id, product_id, user_id, quantity, price) {
    try {
      await db.query(
        "INSERT INTO cart_items (id, product_id, user_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [id, product_id, user_id, quantity, price]
      );
    } catch (err) {
      throw err;
    }
  }

  static async getCartItem(id) {
    try {
      const [rows] = await db.query("SELECT * FROM cart_items WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Cart item not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateCartItem(id, product_id, user_id, quantity, price) {
    try {
      await db.query(
        "UPDATE cart_items SET product_id = ?, user_id = ?, quantity = ?, price = ? WHERE id = ?",
        [product_id, user_id, quantity, price, id]
      );
      const [updatedCartItem] = await db.query(
        "SELECT * FROM cart_items WHERE id = ?",
        [id]
      );
      return updatedCartItem[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteCartItem(id) {
    try {
      await db.query("DELETE FROM cart_items WHERE id = ?", [id]);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Cart;
