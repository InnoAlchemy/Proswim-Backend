const db = require("../config/db");

class ClassCategory {
  static async getAllClassCategories() {
    try {
      const [rows] = await db.query("SELECT * FROM class_categories");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getClassCategory(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM class_categories WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Class Category not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createClassCategory(id, title, header_image, is_active) {
    try {
      await db.query(
        "INSERT INTO class_categories (id, title, header_image, is_active) VALUES (?, ?, ?, ?)",
        [id, title, header_image, is_active]
      );
      const [newClassCategory] = await db.query(
        "SELECT * FROM class_categories WHERE id = ?",
        [id]
      );
      return newClassCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateClassCategory(id, title, header_image, is_active) {
    try {
      await db.query(
        "UPDATE class_categories SET title = ?, header_image = ?, is_active = ? WHERE id = ?",
        [title, header_image, is_active, id]
      );
      const [updatedClassCategory] = await db.query(
        "SELECT * FROM class_categories WHERE id = ?",
        [id]
      );
      return updatedClassCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteClassCategory(id) {
    try {
      await db.query("DELETE FROM class_categories WHERE id = ?", [id]);
      const [ClassCategory] = await db.query(
        "SELECT * FROM class_categories WHERE id = ?",
        [id]
      );
      if (ClassCategory.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ClassCategory;
