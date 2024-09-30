const db = require("../config/db");

class LearnToSwim {
  // Learn to Swim Levels
  static async getAllLevels() {
    try {
      const [rows] = await db.query("SELECT * FROM swim_levels");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getLevel(id) {
    try {
      const [rows] = await db.query("SELECT * FROM swim_levels WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Level not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createLevel(id, title, markdown_text, header_image, is_active) {
    try {
      await db.query(
        "INSERT INTO swim_levels (id, title, markdown_text, header_image, is_active) VALUES (?, ?, ?, ?, ?)",
        [id, title, markdown_text, header_image, is_active]
      );
      const [newLevel] = await db.query(
        "SELECT * FROM swim_levels WHERE id = ?",
        [id]
      );
      return newLevel[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateLevel(id, title, markdown_text, header_image, is_active) {
    try {
      await db.query(
        "UPDATE swim_levels SET title = ?, markdown_text = ?, header_image = ?, is_active = ? WHERE id = ?",
        [title, markdown_text, header_image, is_active, id]
      );
      const [updatedLevel] = await db.query(
        "SELECT * FROM swim_levels WHERE id = ?",
        [id]
      );
      return updatedLevel[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteLevel(id) {
    try {
      await db.query("DELETE FROM swim_levels WHERE id = ?", [id]);
      const [level] = await db.query("SELECT * FROM swim_levels WHERE id = ?", [
        id,
      ]);
      return level.length === 0;
    } catch (err) {
      throw err;
    }
  }

  // Learn to Swim Section Categories
  static async getAllSectionCategories() {
    try {
      const [rows] = await db.query("SELECT * FROM swim_section_categories");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getSectionCategory(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM swim_section_categories WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Section Category not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createSectionCategory(id, title, description, is_active) {
    try {
      await db.query(
        "INSERT INTO swim_section_categories (id, title, description, is_active) VALUES (?, ?, ?, ?)",
        [id, title, description, is_active]
      );
      const [newCategory] = await db.query(
        "SELECT * FROM swim_section_categories WHERE id = ?",
        [id]
      );
      return newCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateSectionCategory(id, title, description, is_active) {
    try {
      const res = await db.query(
        "UPDATE swim_section_categories SET title = ?, description = ?, is_active = ? WHERE id = ?",
        [title, description, is_active, id]
      );
      const [updatedCategory] = await db.query(
        "SELECT * FROM swim_section_categories WHERE id = ?",
        [id]
      );
      console.log(res);
      return updatedCategory[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteSectionCategory(id) {
    try {
      await db.query("DELETE FROM swim_section_categories WHERE id = ?", [id]);
      const [category] = await db.query(
        "SELECT * FROM swim_section_categories WHERE id = ?",
        [id]
      );
      return category.length === 0;
    } catch (err) {
      throw err;
    }
  }

  // Learn to Swim Sections
  static async getAllSections() {
    try {
      const [rows] = await db.query("SELECT * FROM swim_sections");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getSection(level_id, category_id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM swim_sections WHERE level_id = ? AND category_id = ?",
        [level_id, category_id]
      );
      if (rows.length === 0) {
        throw new Error("Section not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createSection(
    level_id,
    markdown_text,
    header_image,
    category_id,
    is_active
  ) {
    try {
      await db.query(
        "INSERT INTO swim_sections (level_id, markdown_text, header_image, category_id, is_active) VALUES (?, ?, ?, ?, ?)",
        [level_id, markdown_text, header_image, category_id, is_active]
      );
      const [newSection] = await db.query(
        "SELECT * FROM swim_sections WHERE level_id = ? AND category_id = ?",
        [level_id, category_id]
      );
      return newSection[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateSection(
    level_id,
    markdown_text,
    header_image,
    category_id,
    is_active
  ) {
    try {
      await db.query(
        "UPDATE swim_sections SET markdown_text = ?, header_image = ?, is_active = ? WHERE level_id = ? AND category_id = ?",
        [markdown_text, header_image, is_active, level_id, category_id]
      );
      const [updatedSection] = await db.query(
        "SELECT * FROM swim_sections WHERE level_id = ? AND category_id = ?",
        [level_id, category_id]
      );
      return updatedSection[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteSection(level_id, category_id) {
    try {
      await db.query(
        "DELETE FROM swim_sections WHERE level_id = ? AND category_id = ?",
        [level_id, category_id]
      );
      const [section] = await db.query(
        "SELECT * FROM swim_sections WHERE level_id = ? AND category_id = ?",
        [level_id, category_id]
      );
      return section.length === 0;
    } catch (err) {
      throw err;
    }
  }

  static async getSectionsByLevelId(level_id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM swim_sections WHERE level_id = ?",
        [level_id]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = LearnToSwim;
