const db = require("../config/db");

class Feedback {
  static async createFeedback({ user_id, subject, body, email }) {
    try {
      await db.query(
        "INSERT INTO feedback (user_id, subject, body, email) VALUES (?, ?, ?, ?)",
        [user_id, subject, body, email]
      );
      const [newFeedback] = await db.query(
        "SELECT * FROM feedback WHERE user_id = ? AND subject = ? AND body = ? AND email = ?",
        [user_id, subject, body, email]
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
}

module.exports = Feedback;
