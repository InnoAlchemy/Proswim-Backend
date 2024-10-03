const db = require("../config/db");

class ClassCategory {
  static async getAllCategories() {
    try {
      const [rows] = await db.query("SELECT * FROM class_categories");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getCategory(id) {
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

  static async createCategory(id, title, description, header_image, is_active) {
    try {
      console.log(is_active);
      await db.query(
        "INSERT INTO class_categories (id, title, description, header_image, is_active) VALUES (?, ?, ?, ?, ?)",
        [id, title, description, header_image, is_active]
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

  static async updateCategory(id, title, description, header_image, is_active) {
    try {
      await db.query(
        "UPDATE class_categories SET title = ?, description = ?, header_image = ?, is_active = ? WHERE id = ?",
        [title, description, header_image, is_active, id]
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

  static async deleteCategory(id) {
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
