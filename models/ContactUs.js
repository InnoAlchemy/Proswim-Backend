const db = require("../config/db");

class ContactUs {
  static async createFormSubmission(name, subject, body, email) {
    try {
      await db.query(
        "INSERT INTO contact_us (name, subject, body, email) VALUES (?, ?, ?, ?)",
        [name, subject, body, email]
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

  static async deleteFormSubmission(id) {
    try {
      await db.query("DELETE FROM contact_us WHERE id = ?", [id]);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ContactUs;
