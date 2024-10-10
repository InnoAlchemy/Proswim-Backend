const db = require("../../config/db");

class Order {
  static async createOrder(orderData) {
    try {
      const { user_id, total_price, status, created_at, products } = orderData;

      // Insert the order first
      const order = await db.query(
        "INSERT INTO orders (user_id, total_price, status, created_at) VALUES ( ?, ?, ?, ?)",
        [user_id, total_price, status, created_at]
      );
      const id = order[0].insertId;
      console.log(id);
      // Now, get the last inserted order's ID
      const [newOrder] = await db.query(
        "SELECT * FROM orders WHERE order_id = ?",
        [id]
      );

      // Insert associated products into a separate products table
      for (const product of products) {
        await db.query(
          "INSERT INTO order_products (order_id, product_id, product_price, product_color, product_gender, product_quantity) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id,
            product.id,
            product.price,
            product.color,
            product.gender,
            product.quantity,
          ]
        );
      }

      return newOrder[0];
    } catch (err) {
      throw err;
    }
  }

  static async getOrder(id) {
    try {
      // Get the order details
      const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Order not found");
      }

      // Get the associated products for the order
      const [products] = await db.query(
        "SELECT * FROM order_products WHERE order_id = ?",
        [id]
      );
      rows[0].products = products; // Add products to the order details

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async deleteOrder(id) {
    try {
      // First, delete the products associated with the order
      await db.query("DELETE FROM order_products WHERE order_id = ?", [id]);
      // Then, delete the order itself
      await db.query("DELETE FROM orders WHERE order_id = ?", [id]);

      const [order] = await db.query(
        "SELECT * FROM orders WHERE order_id = ?",
        [id]
      );
      if (order.length === 0) {
        return true; // Successfully deleted
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Order;
