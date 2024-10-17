const db = require("../../config/db");

class Order {
  static async createOrder(orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { user_id, status, products, currency } = orderData;

      // Insert the order first
      const order = await connection.query(
        "INSERT INTO orders (user_id, total_price, currency, status) VALUES (?, ?, ?, ?)",
        [user_id, 0, currency, status] // total_price is set to 0 initially
      );
      const id = order[0].insertId;

      let totalPrice = 0;

      // Insert associated products into a separate products table
      for (const product of products) {
        const [productDetails] = await connection.query(
          `SELECT 
            ${currency === "USD" ? "price_usd" : "price_lbp"} AS price,
            stock 
          FROM products 
          WHERE id = ?`,
          [product.id]
        );

        if (productDetails.length === 0) {
          throw new Error(`Product with id ${product.id} not found`);
        }

        const { price, stock } = productDetails[0];

        if (stock < product.quantity) {
          throw new Error(`Not enough stock for product with id ${product.id}`);
        }

        totalPrice += price * product.quantity;

        await connection.query(
          "INSERT INTO order_products (order_id, product_id, product_price, product_color, product_gender, product_quantity) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id,
            product.id,
            price,
            product.color,
            product.gender,
            product.quantity,
          ]
        );

        // Decrement the stock
        await connection.query(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [product.quantity, product.id]
        );
      }

      // Update the total price of the order
      await connection.query(
        "UPDATE orders SET total_price = ? WHERE order_id = ?",
        [totalPrice, id]
      );

      // Commit the transaction
      await connection.commit();

      // Now, get the last inserted order's ID
      const [newOrder] = await connection.query(
        "SELECT * FROM orders WHERE order_id = ?",
        [id]
      );

      return id;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
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
