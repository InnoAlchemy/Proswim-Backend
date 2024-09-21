const db = require("../config/db");

class Album {
  static async getAllAlbums() {
    try {
      const [rows] = await db.query("SELECT * FROM albums");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getAlbum(id) {
    try {
      const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("Album not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createAlbum(id, title, description) {
    try {
      const result = await db.query(
        "INSERT INTO albums (id, title, description) VALUES (?, ?, ?)",
        [id, title, description]
      );
      const [newAlbum] = await db.query("SELECT * FROM albums WHERE id = ?", [
        id,
      ]);
      return newAlbum[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateAlbum(id, title, description) {
    try {
      await db.query(
        "UPDATE albums SET title = ?, description = ? WHERE id = ?",
        [title, description, id]
      );
      const [updatedAlbum] = await db.query(
        "SELECT * FROM albums WHERE id = ?",
        [id]
      );
      return updatedAlbum[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteAlbum(id) {
    try {
      await db.query("DELETE FROM albums WHERE id = ?", [id]);
      const [Album] = await db.query("SELECT * FROM albums WHERE id = ?", [id]);
      if (Album.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Album;
