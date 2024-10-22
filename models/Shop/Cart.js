const db = require("../../config/db");

class Cart {
  static async getCartItemsByUserId(userId) {
    try {
      const [rows] = await db.query(
        `SELECT ci.*, g.title as gender_title 
         FROM cart_items ci 
         JOIN genders g ON ci.gender = g.id 
         WHERE ci.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async addCartItem(product_id, user_id, quantity, gender, color, size) {
    try {
      await db.query(
        "INSERT INTO cart_items (product_id, user_id, quantity, gender, color, size) VALUES (?, ?, ?, ?, ?, ?)",
        [product_id, user_id, quantity, gender, color, size]
      );
      const [newItem] = await db.query(
        "SELECT * FROM cart_items WHERE id = LAST_INSERT_ID()"
      );
      return newItem[0];
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

  static async updateCartItem(id, quantity, gender, color, size) {
    try {
      const fields = [];
      const values = [];

      if (quantity !== null) {
        fields.push("quantity = ?");
        values.push(quantity);
      }
      if (gender !== null) {
        fields.push("gender = ?");
        values.push(gender);
      }
      if (color !== null) {
        fields.push("color = ?");
        values.push(color);
      }
      if (size !== null) {
        fields.push("size = ?");
        values.push(size);
      }

      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      values.push(id);

      const query = `UPDATE cart_items SET ${fields.join(", ")} WHERE id = ?`;

      await db.query(query, values);

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
