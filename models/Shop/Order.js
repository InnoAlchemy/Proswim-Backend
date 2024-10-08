const db = require("../../config/db");

class Order {
  static async createOrder(
    user_id,
    product_id,
    quantity,
    total_price,
    status,
    created_at
  ) {
    try {
      await db.query(
        "INSERT INTO orders (user_id, product_id, quantity, total_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, product_id, quantity, total_price, status, created_at]
      );
      const [newOrder] = await db.query(
        "SELECT * FROM orders WHERE id = LAST_INSERT_ID()"
      );
      return newOrder[0];
    } catch (err) {
      throw err;
    }
  }

  static async getOrder(id) {
    try {
      const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Order not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteOrder(id) {
    try {
      await db.query("DELETE FROM orders WHERE id = ?", [id]);
      const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
      if (order.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Order;
