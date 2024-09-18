const db = require("../config/db");

class Banner {
  static async getAllBanners() {
    try {
      const [rows] = await db.query("SELECT * FROM banners");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getBanner(id) {
    try {
      const [rows] = await db.query("SELECT * FROM banners WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Banner not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createBanner(id, image, title, is_active) {
    try {
      const result = await db.query(
        "INSERT INTO banners (id, image, title, is_active) VALUES (?, ?, ?, ?)",
        [id, image, title, is_active]
      );
      const [newBanner] = await db.query("SELECT * FROM banners WHERE id = ?", [
        id,
      ]);
      return newBanner[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateBanner(id, image, title, is_active) {
    try {
      await db.query(
        "UPDATE banners SET image = ?, title = ?, is_active = ? WHERE id = ?",
        [image, title, is_active, id]
      );
      const [updatedBanner] = await db.query(
        "SELECT * FROM banners WHERE id = ?",
        [id]
      );
      return updatedBanner[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteBanner(id) {
    try {
      await db.query("DELETE FROM banners WHERE id = ?", [id]);
      const [banner] = await db.query("SELECT * FROM banners WHERE id = ?", [
        id,
      ]);
      if (banner.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Banner;
