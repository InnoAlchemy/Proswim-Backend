const db = require("../../config/db");

class Payment {
  static async createPayment(id, user_id, product_id, payment_info, amount) {
    try {
      await db.query(
        "INSERT INTO payments (id, user_id, product_id, payment_info, amount) VALUES (?, ?, ?, ?, ?)",
        [id, user_id, product_id, payment_info, amount]
      );
      const [newPayment] = await db.query(
        "SELECT * FROM payments WHERE id = ?",
        [id]
      );
      return newPayment[0];
    } catch (err) {
      throw err;
    }
  }

  static async getPayment(id) {
    try {
      const [rows] = await db.query("SELECT * FROM payments WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Payment not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deletePayment(id) {
    try {
      await db.query("DELETE FROM payments WHERE id = ?", [id]);
      const [payment] = await db.query("SELECT * FROM payments WHERE id = ?", [
        id,
      ]);
      if (payment.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Payment;
