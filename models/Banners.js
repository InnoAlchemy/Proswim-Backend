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

  static async createBanner(image, title, is_active) {
    try {
      const result = await db.query(
        "INSERT INTO banners (image, title, is_active) VALUES (?, ?, ?)",
        [image, title, is_active]
      );
      const [newBanner] = await db.query(
        "SELECT * FROM banners WHERE id = LAST_INSERT_ID()"
      );
      return newBanner[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateBanner(id, { image, title, is_active }) {
    try {
      console.log(image);
      let query = "UPDATE banners SET title = ?, is_active = ?";
      let params = [title, is_active];

      if (image !== null) {
        query += ", image = ?";
        params.push(image);
      }

      query += " WHERE id = ?";
      params.push(id);

      await db.query(query, params);

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
