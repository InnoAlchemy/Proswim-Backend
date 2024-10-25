const db = require("../config/db");

class ScheduleCall {
  static async createSubmission(name, email, phone_number, date, user_Id) {
    try {
      await db.query(
        "INSERT INTO schedule_calls (name, email, phone_number, date, user_Id) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone_number, date, user_Id]
      );
      const [newSubmission] = await db.query(
        "SELECT * FROM schedule_calls WHERE name = ? AND email = ? AND phone_number = ? AND date = ? AND user_Id = ?",
        [name, email, phone_number, date, user_Id]
      );
      return newSubmission[0];
    } catch (err) {
      throw err;
    }
  }

  static async getSubmissions() {
    try {
      const [rows] = await db.query("SELECT * FROM schedule_calls");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async deleteSubmission(id) {
    try {
      const [result] = await db.query(
        "DELETE FROM schedule_calls WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ScheduleCall;
