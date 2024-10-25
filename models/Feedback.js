const db = require("../config/db");

class Feedback {
  static async createFeedback({ name, subject, body, email, user_id }) {
    try {
      await db.query(
        "INSERT INTO feedback (name, subject, body, email, user_id) VALUES (?, ?, ?, ?, ?)",
        [name, subject, body, email, user_id]
      );
      const [newFeedback] = await db.query(
        "SELECT * FROM feedback WHERE name = ? AND subject = ? AND body = ? AND email = ? AND user_id = ?",
        [name, subject, body, email, user_id]
      );
      return newFeedback[0];
    } catch (err) {
      throw err;
    }
  }

  static async getFeedbacks() {
    try {
      const [rows] = await db.query("SELECT * FROM feedback");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async deleteFeedback(id) {
    try {
      const [result] = await db.query("DELETE FROM feedback WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Feedback;
