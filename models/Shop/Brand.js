const db = require("../../config/db");

class Brand {
  static async getAllBrands() {
    try {
      const [rows] = await db.query("SELECT * FROM brands");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getBrand(id) {
    try {
      const [rows] = await db.query("SELECT * FROM brands WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Brand not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createBrand(title, is_active) {
    try {
      await db.query("INSERT INTO brands (title, is_active) VALUES (?, ?)", [
        title,
        is_active,
      ]);
      const [newBrand] = await db.query(
        "SELECT * FROM brands WHERE id = LAST_INSERT_ID()"
      );
      return newBrand[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateBrand(id, title, is_active) {
    try {
      await db.query(
        "UPDATE brands SET title = ?, is_active = ? WHERE id = ?",
        [title, is_active, id]
      );
      const [updatedBrand] = await db.query(
        "SELECT * FROM brands WHERE id = ?",
        [id]
      );
      return updatedBrand[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteBrand(id) {
    try {
      await db.query("DELETE FROM brands WHERE id = ?", [id]);
      const [brand] = await db.query("SELECT * FROM brands WHERE id = ?", [id]);
      if (brand.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Brand;
