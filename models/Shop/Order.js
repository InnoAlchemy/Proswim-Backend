const db = require("../../config/db");

class Order {
  static async createOrder(orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { user_id, status, products, currency, address, user_name } =
        orderData;

      // Insert the order first
      const order = await connection.query(
        "INSERT INTO orders (user_id, user_name, total_price, currency, status, address) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, user_name, 0, currency, status, address] // total_price is set to 0 initially
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
          "INSERT INTO order_products (order_id, product_id, product_price, product_color, product_gender, product_quantity, product_size) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            product.id,
            price,
            product.color,
            product.gender,
            product.quantity,
            product.size,
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

      // Get the user's email
      const [user] = await db.query("SELECT email FROM users WHERE id = ?", [
        rows[0].user_id,
      ]);
      if (user.length > 0) {
        rows[0].user_email = user[0].email; // Add email to the order details
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

  static async getOrdersByUser(userId) {
    try {
      const [orders] = await db.query(
        "SELECT * FROM orders WHERE user_id = ?",
        [userId]
      );
      for (const order of orders) {
        // Get the user's email
        const [user] = await db.query(
          "SELECT email FROM users WHERE user_id = ?",
          [order.user_id]
        );
        if (user.length > 0) {
          order.user_email = user[0].email; // Add email to the order details
        }

        const [products] = await db.query(
          "SELECT * FROM order_products WHERE order_id = ?",
          [order.order_id]
        );
        order.products = products;
      }

      return orders;
    } catch (err) {
      throw err;
    }
  }

  static async getAllOrders() {
    try {
      const [orders] = await db.query("SELECT * FROM orders");
      for (const order of orders) {
        // Get the user's email
        const [user] = await db.query("SELECT email FROM users WHERE id = ?", [
          order.user_id,
        ]);
        if (user.length > 0) {
          order.user_email = user[0].email; // Add email to the order details
        }

        // Get the associated products for each order
        const [products] = await db.query(
          "SELECT * FROM order_products WHERE order_id = ?",
          [order.order_id]
        );
        order.products = products;
      }

      return orders;
    } catch (err) {
      throw err;
    }
  }

  static async updateOrder(id, orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { status, products, currency, address } = orderData;

      // Update the order details
      await connection.query(
        "UPDATE orders SET status = ?, currency = ?, address = ? WHERE order_id = ?",
        [status, currency, address, id]
      );

      // Delete existing products associated with the order
      await connection.query("DELETE FROM order_products WHERE order_id = ?", [
        id,
      ]);

      let totalPrice = 0;

      // Insert updated products into the order_products table
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
          "INSERT INTO order_products (order_id, product_id, product_price, product_color, product_gender, product_quantity, product_size) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            product.id,
            price,
            product.color,
            product.gender,
            product.quantity,
            product.size,
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
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = Order;
