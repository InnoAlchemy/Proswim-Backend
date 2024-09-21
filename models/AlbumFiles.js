const db = require("../config/db");

class Album {
  static async getAllAlbumFiles() {
    try {
      const [rows] = await db.query("SELECT * FROM album_files");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getAlbumFile(id) {
    try {
      const [rows] = await db.query("SELECT * FROM album_files WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Album File not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createAlbumFile(
    id,
    title,
    album_id,
    collection_number,
    file,
    short_description
  ) {
    try {
      const result = await db.query(
        "INSERT INTO album_files (id, title, album_id, collection_number, file, short_description) VALUES (?, ?, ?, ?, ?, ?)",
        [id, title, album_id, collection_number, file, short_description]
      );
      const [newAlbumFile] = await db.query(
        "SELECT * FROM album_files WHERE id = ?",
        [id]
      );
      return newAlbumFile[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateAlbumFile(
    id,
    title,
    album_id,
    collection_number,
    file,
    short_description
  ) {
    try {
      const res = await db.query(
        "UPDATE album_files SET title = ?, album_id = ? , collection_number = ?, file = ?, short_description = ? WHERE id = ?",
        [title, album_id, collection_number, file, short_description, id]
      );
      console.log(res);
      const [updatedAlbumFile] = await db.query(
        "SELECT * FROM album_files WHERE id = ?",
        [id]
      );
      return updatedAlbumFile[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteAlbumFile(id) {
    try {
      await db.query("DELETE FROM album_files WHERE id = ?", [id]);
      const [AlbumFile] = await db.query(
        "SELECT * FROM album_files WHERE id = ?",
        [id]
      );
      if (AlbumFile.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Album;
