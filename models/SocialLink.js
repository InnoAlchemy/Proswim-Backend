const db = require("../config/db");

class SocialLink {
  static async getSocialLinks() {
    try {
      const [rows] = await db.query("SELECT * FROM social_links");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async createSocialLink({ icon, link, is_active }) {
    try {
      await db.query(
        "INSERT INTO social_links (icon, link, is_active) VALUES (?, ?, ?)",
        [icon, link, is_active]
      );
      const [newSocialLink] = await db.query(
        "SELECT * FROM social_links WHERE icon = ? AND link = ?",
        [icon, link]
      );
      return newSocialLink[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateSocialLink(id, { icon, link, is_active }) {
    try {
      await db.query(
        "UPDATE social_links SET icon = ?, link = ?, is_active = ? WHERE id = ?",
        [icon, link, is_active, id]
      );
      const [updatedSocialLink] = await db.query(
        "SELECT * FROM social_links WHERE id = ?",
        [id]
      );
      return updatedSocialLink[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteSocialLink(id) {
    try {
      await db.query("DELETE FROM social_links WHERE id = ?", [id]);
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = SocialLink;