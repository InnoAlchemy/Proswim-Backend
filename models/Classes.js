const db = require("../config/db");

class Class {
  static async getAllClasses() {
    try {
      const [rows] = await db.query(`
        SELECT c.*, cc.id AS content_id, cc.title, cc.description, cc.image
        FROM classes c
        LEFT JOIN class_contents cc ON c.id = cc.class_id
      `);

      const classes = rows.reduce((acc, row) => {
        const {
          id,
          class_category_id,
          markdown_text,
          is_active,
          button_text,
          content_id,
          title,
          description,
          image,
        } = row;

        const existingClass = acc.find((c) => c.id === id);
        const contentItem = { title, description, image };

        if (existingClass) {
          existingClass.list_of_content.push(contentItem);
        } else {
          acc.push({
            id,
            class_category_id,
            markdown_text,
            is_active,
            button_text,
            list_of_content: content_id ? [contentItem] : [],
          });
        }

        return acc;
      }, []);

      return classes;
    } catch (err) {
      throw err;
    }
  }

  static async getClass(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT c.*, cc.id AS content_id, cc.title, cc.description, cc.image
        FROM classes c
        LEFT JOIN class_contents cc ON c.id = cc.class_id
        WHERE c.id = ?
      `,
        [id]
      );

      if (rows.length === 0) {
        throw new Error("Class not found");
      }

      const class_object = {
        id: rows[0].id,
        class_category_id: rows[0].class_category_id,
        markdown_text: rows[0].markdown_text,
        is_active: rows[0].is_active,
        button_text: rows[0].button_text,
        list_of_content: rows
          .map((row) => ({
            title: row.title,
            description: row.description,
            image: row.image,
          }))
          .filter((content) => content.title),
      };

      return class_object;
    } catch (err) {
      throw err;
    }
  }

  static async createClass(
    class_category_id,
    markdown_text,
    is_active,
    button_text,
    list_of_content
  ) {
    try {
      const res = await db.query(
        "INSERT INTO classes (class_category_id, markdown_text, is_active, button_text) VALUES (?, ?, ?, ?)",
        [class_category_id, markdown_text, is_active, button_text]
      );
      const id = res[0].insertId;

      if (Array.isArray(list_of_content) && list_of_content.length > 0) {
        await Promise.all(
          list_of_content.map((content) => {
            return db.query(
              "INSERT INTO class_contents (class_id, title, description, image) VALUES (?, ?, ?, ?)",
              [id, content.title, content.description, content.image]
            );
          })
        );
      }

      const [newClass] = await db.query(
        `SELECT c.*, cc.id AS content_id, cc.title, cc.description, cc.image
         FROM classes c
         LEFT JOIN class_contents cc ON c.id = cc.class_id
         WHERE c.id = ?`,
        [id]
      );

      const createdClass = {
        id: newClass[0].id,
        class_category_id: newClass[0].class_category_id,
        markdown_text: newClass[0].markdown_text,
        is_active: newClass[0].is_active,
        button_text: newClass[0].button_text,
        list_of_content: newClass
          .map((row) => ({
            title: row.title,
            description: row.description,
            image: row.image,
          }))
          .filter((content) => content.title),
      };

      return createdClass;
    } catch (err) {
      throw err;
    }
  }

  static async updateClass(
    id,
    class_category_id,
    markdown_text,
    is_active,
    button_text,
    list_of_content
  ) {
    try {
      await db.query(
        "UPDATE classes SET class_category_id = ?, markdown_text = ?, is_active = ?, button_text = ? WHERE id = ?",
        [class_category_id, markdown_text, is_active, button_text, id]
      );

      await db.query("DELETE FROM class_contents WHERE class_id = ?", [id]);

      if (list_of_content && list_of_content.length > 0) {
        const insertContentPromises = list_of_content.map((content) => {
          const { title, description, image } = content;
          const query = image
            ? "INSERT INTO class_contents (class_id, title, description, image) VALUES (?, ?, ?, ?)"
            : "INSERT INTO class_contents (class_id, title, description) VALUES (?, ?, ?)";
          const params = image
            ? [id, title, description, image]
            : [id, title, description];
          return db.query(query, params);
        });
        await Promise.all(insertContentPromises);
      }

      const [updatedClass] = await db.query(
        `SELECT c.*, cc.id AS content_id, cc.title, cc.description, cc.image
         FROM classes c
         LEFT JOIN class_contents cc ON c.id = cc.class_id
         WHERE c.id = ?`,
        [id]
      );

      const class_object = {
        id: updatedClass[0].id,
        class_category_id: updatedClass[0].class_category_id,
        markdown_text: updatedClass[0].markdown_text,
        is_active: updatedClass[0].is_active,
        button_text: updatedClass[0].button_text,
        list_of_content: updatedClass
          .map((row) => ({
            title: row.title,
            description: row.description,
            image: row.image,
          }))
          .filter((content) => content.title),
      };

      return class_object;
    } catch (err) {
      throw err;
    }
  }

  static async deleteClass(id) {
    try {
      await db.query("DELETE FROM class_contents WHERE class_id = ?", [id]);

      await db.query("DELETE FROM classes WHERE id = ?", [id]);

      const [deletedClass] = await db.query(
        "SELECT * FROM classes WHERE id = ?",
        [id]
      );
      if (deletedClass.length === 0) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Class;
