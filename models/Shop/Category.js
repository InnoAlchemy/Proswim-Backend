const db = require("../../config/db");

class Category {
  static async getAllCategories() {
    try {
      const [rows] = await db.query("SELECT * FROM categories");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getCategory(id) {
    try {
      const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Category not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createCategory(title, is_active) {
    try {
      await db.query(
        "INSERT INTO categories (title, is_active) VALUES ( ?, ?)",
        [title, is_active]
      );
      const [newCategory] = await db.query(
        "SELECT * FROM categories WHERE id = LAST_INSERT_ID()"
      );
      return newCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateCategory(id, title, is_active) {
    try {
      await db.query(
        "UPDATE categories SET title = ?, is_active = ? WHERE id = ?",
        [title, is_active, id]
      );
      const [updatedCategory] = await db.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
      );
      return updatedCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteCategory(id) {
    try {
      await db.query("DELETE FROM categories WHERE id = ?", [id]);
      const [category] = await db.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
      );
      if (category.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Category;
