const db = require("../config/db");

class LearnToSwim {
  static async getAllLevels() {
    const query = "SELECT * FROM swim_levels WHERE is_active = true";
    const [results] = await db.execute(query);
    return results;
  }

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

  static async deleteLevel(id) {
    const query = "DELETE FROM swim_levels WHERE id = ?";
    await db.execute(query, [id]);
    return id;
  }

  static async getLearnToSwimSections() {
    try {
      const query = `
        SELECT 
          s.*, 
          c.title AS content_title, 
          c.description AS content_description, 
          c.image AS content_image
        FROM swim_sections s
        LEFT JOIN swim_content c ON s.id = c.section_id
      `;

      const [rows] = await db.execute(query);

      const sections = rows.reduce((acc, row) => {
        const sectionId = row.id;
        if (!acc[sectionId]) {
          acc[sectionId] = {
            id: row.id,
            level_id: row.level_id,
            title: row.title,
            markdown_text: row.markdown_text,
            header_image: row.header_image,
            is_active: row.is_active,
            list_of_content: [],
          };
        }
        if (row.content_title) {
          acc[sectionId].list_of_content.push({
            title: row.content_title,
            description: row.content_description,
            image: row.content_image,
          });
        }
        return acc;
      }, {});

      return Object.values(sections);
    } catch (err) {
      throw err;
    }
  }

  static async getSection(id) {
    try {
      const [rows] = await db.query(
        `
          SELECT s.*, c.title AS content_title, c.description, c.image
          FROM swim_sections s
          LEFT JOIN swim_content c ON s.id = c.section_id
          WHERE s.id = ?
        `,
        [id]
      );

      if (rows.length === 0) {
        throw new Error("Section not found");
      }

      const section = {
        id: rows[0].id,
        level_id: rows[0].level_id,
        title: rows[0].title,
        markdown_text: rows[0].markdown_text,
        header_image: rows[0].header_image,
        is_active: rows[0].is_active,
        list_of_content: rows
          .map((row) => ({
            title: row.content_title,
            description: row.description,
            image: row.image,
          }))
          .filter((content) => content.title),
      };

      return section;
    } catch (err) {
      throw err;
    }
  }

  static async createSection(
    id,
    level_id,
    title,
    markdown_text,
    list_of_content,
    header_image,
    is_active
  ) {
    try {
      const query =
        "INSERT INTO swim_sections (id ,level_id, title, markdown_text, header_image, is_active) VALUES (?, ?, ?, ?, ?, ?)";
      const [result] = await db.execute(query, [
        id,
        level_id,
        title,
        markdown_text,
        header_image,
        is_active,
      ]);

      if (list_of_content && list_of_content.length > 0) {
        const contentPromises = list_of_content.map((content) => {
          return db.execute(
            "INSERT INTO swim_content (section_id, title, description, image) VALUES (?, ?, ?, ?)",
            [id, content.title, content.description, content.image]
          );
        });
        await Promise.all(contentPromises);
      }

      return {
        id: id,
        level_id,
        title,
        markdown_text,
        header_image,
        is_active,
        list_of_content,
      };
    } catch (err) {
      throw err;
    }
  }

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
      "UPDATE swim_sections SET level_id = ?, title = ?, markdown_text = ?, header_image = ?, is_active = ? WHERE id = ?";
    await db.execute(query, [
      level_id,
      title,
      markdown_text,
      header_image,
      is_active,
      id,
    ]);

    const deleteContentQuery = "DELETE FROM swim_content WHERE section_id = ?";
    await db.execute(deleteContentQuery, [id]);

    if (list_of_content && list_of_content.length > 0) {
      const contentPromises = list_of_content.map((content) => {
        return db.execute(
          "INSERT INTO swim_content (section_id, title, description, image) VALUES (?, ?, ?, ?)",
          [id, content.title, content.description, content.image]
        );
      });
      await Promise.all(contentPromises);
    }

    return {
      id,
      level_id,
      title,
      markdown_text,
      header_image,
      is_active,
      list_of_content,
    };
  }

  static async deleteSection(id) {
    try {
      const deleteContentQuery =
        "DELETE FROM swim_content WHERE section_id = ?";
      await db.execute(deleteContentQuery, [id]);

      const deleteSectionQuery = "DELETE FROM swim_sections WHERE id = ?";
      await db.execute(deleteSectionQuery, [id]);

      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = LearnToSwim;
