const db = require("../config/db");

class core {
  static async getAllcores() {
    try {
      const [rows] = await db.query("SELECT * FROM core_values");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getCore(id) {
    try {
      const [rows] = await db.query("SELECT * FROM core_values WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("core not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createCore(id, image, title, description, is_active) {
    try {
      const result = await db.query(
        "INSERT INTO core_values (id, image, title, description, is_active) VALUES (?, ?, ?, ?, ?)",
        [id, image, title, description, is_active]
      );
      const [newcore] = await db.query(
        "SELECT * FROM core_values WHERE id = ?",
        [id]
      );
      return newcore[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateCore(id, image, title, description, is_active) {
    try {
      await db.query(
        "UPDATE core_values SET image = ?, title = ?, description = ?, is_active = ? WHERE id = ?",
        [image, title, description, is_active, id]
      );
      const [updatedcore] = await db.query(
        "SELECT * FROM core_values WHERE id = ?",
        [id]
      );
      return updatedcore[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteCore(id) {
    try {
      await db.query("DELETE FROM core_values WHERE id = ?", [id]);
      const [core] = await db.query("SELECT * FROM core_values WHERE id = ?", [
        id,
      ]);
      if (core.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = core;
