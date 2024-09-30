const db = require("../config/db");

class Class {
  static async getAllClasses() {
    try {
      const [rows] = await db.query("SELECT * FROM classes");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getClass(id) {
    try {
      const [rows] = await db.query("SELECT * FROM classes WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Class not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createClass(
    id,
    class_category_id,
    markdown_text,
    is_active,
    button_text
  ) {
    try {
      await db.query(
        "INSERT INTO classes (id, class_category_id, markdown_text, is_active, button_text) VALUES (?, ?, ?, ?, ?)",
        [id, class_category_id, markdown_text, is_active, button_text]
      );
      const [newClass] = await db.query("SELECT * FROM classes WHERE id = ?", [
        id,
      ]);
      return newClass[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateClass(
    id,
    class_category_id,
    markdown_text,
    is_active,
    button_text
  ) {
    try {
      await db.query(
        "UPDATE classes SET class_category_id = ?, markdown_text = ?, is_active = ?, button_text = ? WHERE id = ?",
        [class_category_id, markdown_text, is_active, button_text, id]
      );
      const [updatedClass] = await db.query(
        "SELECT * FROM classes WHERE id = ?",
        [id]
      );
      return updatedClass[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteClass(id) {
    try {
      await db.query("DELETE FROM classes WHERE id = ?", [id]);
      const [deletedClass] = await db.query(
        "SELECT * FROM classes WHERE id = ?",
        [id]
      );
      if (deletedClass.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Class;
