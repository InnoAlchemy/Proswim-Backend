const db = require("../config/db");

class Feedback {
  static async createFeedback({ name, subject, body, email }) {
    try {
      await db.query(
        "INSERT INTO feedback (name, subject, body, email) VALUES (?, ?, ?, ?)",
        [name, subject, body, email]
      );
      const [newFeedback] = await db.query(
        "SELECT * FROM feedback WHERE name = ? AND subject = ? AND body = ? AND email = ?",
        [name, subject, body, email]
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
