const db = require("../config/db");

class Description {
  static async getDescription() {
    try {
      const [rows] = await db.query("SELECT * FROM footer_description LIMIT 1");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async createDescription(text) {
    try {
      await db.query("INSERT INTO footer_description (text) VALUES (?)", [
        text,
      ]);
      const [newDescription] = await db.query(
        "SELECT * FROM footer_description WHERE text = ?",
        [text]
      );
      return newDescription[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateDescription(text) {
    try {
      await db.query("UPDATE footer_description SET text = ? WHERE id = 1", [
        text,
      ]);
      const [updatedDescription] = await db.query(
        "SELECT * FROM footer_description WHERE id = 1"
      );
      return updatedDescription[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteDescription() {
    try {
      await db.query("DELETE FROM footer_description WHERE id = 1");
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Description;
