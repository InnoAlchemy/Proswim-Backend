const db = require("../config/db");

class ContactUs {
  static async createFormSubmission(user_id, subject, body, email) {
    try {
      await db.query(
        "INSERT INTO contact_us (user_id, subject, body, email) VALUES (?, ?, ?, ?)",
        [user_id, subject, body, email]
      );
    } catch (err) {
      throw err;
    }
  }

  static async getAllFormSubmissions() {
    try {
      const [rows] = await db.query("SELECT * FROM contact_us");
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ContactUs;
