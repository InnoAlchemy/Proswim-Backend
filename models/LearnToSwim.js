const db = require("../config/db");

class LearnToSwim {
  // Get all levels
  static async getAllLevels() {
    const query = "SELECT * FROM swim_levels WHERE is_active = true";
    const [results] = await db.execute(query);
    return results;
  }

  // Create a new level
  static async createLevel(id, title, markdown_text, header_image, is_active) {
    const query =
      "INSERT INTO swim_levels (id, title, markdown_text, header_image, is_active) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      id,
      title,
      markdown_text,
      header_image,
      is_active,
    ]);
    return {
      id,
      title,
      markdown_text,
      header_image,
      is_active,
    };
  }

  // Update an existing level
  static async updateLevel(id, title, markdown_text, header_image, is_active) {
    const query =
      "UPDATE swim_levels SET title = ?, markdown_text = ?, header_image = ?, is_active = ? WHERE id = ?";
    await db.execute(query, [
      title,
      markdown_text,
      header_image,
      is_active,
      id,
    ]);
    return {
      id,
      title,
      markdown_text,
      header_image,
      is_active,
    };
  }

  // Delete a level
  static async deleteLevel(id) {
    const query = "DELETE FROM swim_levels WHERE id = ?";
    await db.execute(query, [id]);
    return id;
  }

  // Get all sections
  static async getAllSections() {
    const query = "SELECT * FROM swim_sections WHERE is_active = true";
    const [results] = await db.execute(query);
    return results;
  }

  // Create a new section
  static async createSection(
    level_id,
    title,
    markdown_text,
    list_of_content,
    header_image,
    is_active
  ) {
    const query =
      "INSERT INTO swim_sections (level_id, title, markdown_text, list_of_content, header_image, is_active) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      level_id,
      title,
      markdown_text,
      JSON.stringify(list_of_content),
      header_image,
      is_active,
    ]);
    return {
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active,
    };
  }

  // Update an existing section
  static async updateSection(
    id,
    level_id,
    title,
    markdown_text,
    list_of_content,
    header_image,
    is_active
  ) {
    const query =
      "UPDATE swim_sections SET level_id = ?, title = ?, markdown_text = ?, list_of_content = ?, header_image = ?, is_active = ? WHERE id = ?";
    await db.execute(query, [
      level_id,
      title,
      markdown_text,
      JSON.stringify(list_of_content),
      header_image,
      is_active,
      id,
    ]);
    return {
      id,
      level_id,
      title,
      markdown_text,
      list_of_content,
      header_image,
      is_active,
    };
  }

  // Delete a section
  static async deleteSection(id) {
    const query = "DELETE FROM swim_sections WHERE id = ?";
    await db.execute(query, [id]);
    return id;
  }
}

module.exports = LearnToSwim;
