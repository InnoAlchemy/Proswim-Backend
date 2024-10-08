const db = require("../config/db");

class AboutUs {
  static async getAllCategories() {
    try {
      const [rows] = await db.query("SELECT * FROM about_us_categories");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getCategory(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM about_us_categories WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Category not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createCategory(
    id,
    title,
    markdown_text,
    header_image,
    is_active
  ) {
    try {
      const result = await db.query(
        "INSERT INTO about_us_categories (title, markdown_text, header_image, is_active) VALUES (?, ?, ?, ?, ?)",
        [title, markdown_text, header_image, is_active]
      );
      const [newCategory] = await db.query(
        "SELECT * FROM about_us_categories WHERE id = LAST_INSERT_ID()"
      );
      return newCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateCategory(
    id,
    title,
    markdown_text,
    header_image,
    is_active
  ) {
    try {
      let query =
        "UPDATE about_us_categories SET title = ?, markdown_text = ?, is_active = ?";
      let params = [title, markdown_text, is_active];

      if (header_image !== null) {
        query += ", header_image = ?";
        params.push(header_image);
      }

      query += " WHERE id = ?";
      params.push(id);

      const res = await db.query(query, params);
      console.log(res);
      const [updatedCategory] = await db.query(
        "SELECT * FROM about_us_categories WHERE id = ?",
        [id]
      );
      return updatedCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteCategory(id) {
    try {
      await db.query("DELETE FROM about_us_categories WHERE id = ?", [id]);
      const [category] = await db.query(
        "SELECT * FROM about_us_categories WHERE id = ?",
        [id]
      );
      if (category.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  static async getAllInfo() {
    try {
      const [rows] = await db.query("SELECT * FROM about_us_information");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getInfo(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM about_us_information WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Info not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createInfo(category_id, markdown_text, image, type) {
    try {
      const result = await db.query(
        "INSERT INTO about_us_information (category_id, markdown_text, image, type) VALUES (?, ?, ?, ?)",
        [id, category_id, markdown_text, image, type]
      );
      const [newInfo] = await db.query(
        "SELECT * FROM about_us_information WHERE id = LAST_INSERT_ID()"
      );
      return newInfo[0];
    } catch (err) {
      throw err;
    }
  }
  static async updateInfo(id, category_id, markdown_text, image, type) {
    try {
      let query =
        "UPDATE about_us_information SET category_id = ?, markdown_text = ?, type = ?";
      let params = [category_id, markdown_text, type];

      if (image !== null) {
        query += ", image = ?";
        params.push(image);
      }

      query += " WHERE id = ?";
      params.push(id);

      const res = await db.query(query, params);
      console.log(res);
      const [updatedInfo] = await db.query(
        "SELECT * FROM about_us_information WHERE id = ?",
        [id]
      );
      return updatedInfo[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteInfo(id) {
    try {
      await db.query("DELETE FROM about_us_information WHERE id = ?", [id]);
      const [info] = await db.query(
        "SELECT * FROM about_us_information WHERE id = ?",
        [id]
      );
      if (info.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AboutUs;
