const db = require("../../config/db");

class Gender {
  static async getAllGenders() {
    try {
      const [rows] = await db.query("SELECT * FROM genders");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getGender(id) {
    try {
      const [rows] = await db.query("SELECT * FROM genders WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Gender not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createGender(id, title, is_active) {
    try {
      await db.query(
        "INSERT INTO genders (id, title, is_active) VALUES (?, ?, ?)",
        [id, title, is_active]
      );
      const [newGender] = await db.query("SELECT * FROM genders WHERE id = ?", [
        id,
      ]);
      return newGender[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateGender(id, title, is_active) {
    try {
      await db.query(
        "UPDATE genders SET title = ?, is_active = ? WHERE id = ?",
        [title, is_active, id]
      );
      const [updatedGender] = await db.query(
        "SELECT * FROM genders WHERE id = ?",
        [id]
      );
      return updatedGender[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteGender(id) {
    try {
      await db.query("DELETE FROM genders WHERE id = ?", [id]);
      const [gender] = await db.query("SELECT * FROM genders WHERE id = ?", [
        id,
      ]);
      if (gender.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Gender;
