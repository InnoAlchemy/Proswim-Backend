const db = require("../config/db");

class Button {
  static async getAllButtons() {
    try {
      const [rows] = await db.query("SELECT * FROM lts_buttons");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getButton(id) {
    try {
      const [rows] = await db.query("SELECT * FROM lts_buttons WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Button not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createButton(image, page_link, is_active) {
    try {
      const result = await db.query(
        "INSERT INTO lts_buttons (image, page_link, is_active) VALUES (?, ?, ?)",
        [image, page_link, is_active]
      );
      const [newButton] = await db.query(
        "SELECT * FROM lts_buttons WHERE id = LAST_INSERT_ID()"
      );
      return newButton[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateButton(id, image, page_link, is_active) {
    try {
      let query =
        "UPDATE lts_buttons SET page_link = ?, is_active = ? WHERE id = ?";
      let params = [page_link, is_active, id];

      if (image !== null) {
        query =
          "UPDATE lts_buttons SET image = ?, page_link = ?, is_active = ? WHERE id = ?";
        params = [image, page_link, is_active, id];
      }

      await db.query(query, params);

      const [updatedButton] = await db.query(
        "SELECT * FROM lts_buttons WHERE id = ?",
        [id]
      );
      return updatedButton[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteButton(id) {
    try {
      await db.query("DELETE FROM lts_buttons WHERE id = ?", [id]);
      const [Button] = await db.query(
        "SELECT * FROM lts_buttons WHERE id = ?",
        [id]
      );
      if (Button.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Button;
