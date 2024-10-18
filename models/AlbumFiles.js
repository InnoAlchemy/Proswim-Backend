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
    title,
    album_id,
    collection_number,
    files,
    short_description
  ) {
    try {
      const result = await db.query(
        "INSERT INTO album_files (title, album_id, collection_number, files, short_description) VALUES (?, ?, ?, ?, ?)",
        [title, album_id, collection_number, files, short_description]
      );
      const [newAlbumFile] = await db.query(
        "SELECT * FROM album_files WHERE id = LAST_INSERT_ID()"
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
    files,
    short_description
  ) {
    try {
      let query =
        "UPDATE album_files SET title = ?, album_id = ?, collection_number = ?, short_description = ?";
      let queryParams = [title, album_id, collection_number, short_description];

      if (files) {
        query += ", files = ?";
        queryParams.push(files);
      }

      query += " WHERE id = ?";
      queryParams.push(id);

      await db.query(query, queryParams);

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
