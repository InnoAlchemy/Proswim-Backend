const db = require("../../config/db");

class Sport {
  static async getAllSports() {
    try {
      const [rows] = await db.query("SELECT * FROM sports");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getSport(id) {
    try {
      const [rows] = await db.query("SELECT * FROM sports WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Sport not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createSport(title, is_active) {
    try {
      await db.query("INSERT INTO sports (title, is_active) VALUES (?, ?)", [
        title,
        is_active,
      ]);
      const [newSport] = await db.query(
        "SELECT * FROM sports WHERE id = LAST_INSERT_ID()"
      );
      return newSport[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateSport(id, title, is_active) {
    try {
      await db.query(
        "UPDATE sports SET title = ?, is_active = ? WHERE id = ?",
        [title, is_active, id]
      );
      const [updatedSport] = await db.query(
        "SELECT * FROM sports WHERE id = ?",
        [id]
      );
      return updatedSport[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteSport(id) {
    try {
      await db.query("DELETE FROM sports WHERE id = ?", [id]);
      const [sport] = await db.query("SELECT * FROM sports WHERE id = ?", [id]);
      if (sport.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Sport;
