const db = require("../config/db");

class Location {
  static async getAllLocations() {
    try {
      const [rows] = await db.query("SELECT * FROM locations");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getLocation(id) {
    try {
      const [rows] = await db.query("SELECT * FROM locations WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Location File not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createLocation(
    id,
    image,
    supervisor,
    phone_number,
    website,
    info,
    is_active
  ) {
    try {
      const result = await db.query(
        "INSERT INTO locations (id, image, supervisor, phone_number, website, info, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, image, supervisor, phone_number, website, info, is_active]
      );
      const [newLocation] = await db.query(
        "SELECT * FROM locations WHERE id = ?",
        [id]
      );
      return newLocation[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateLocation(
    id,
    image,
    supervisor,
    phone_number,
    website,
    info,
    is_active
  ) {
    try {
      const res = await db.query(
        "UPDATE locations SET image = ?, supervisor = ? , phone_number = ?, website = ?, info = ?, is_active = ? WHERE id = ?",
        [image, supervisor, phone_number, website, info, is_active, id]
      );
      console.log(res);
      const [updatedLocation] = await db.query(
        "SELECT * FROM locations WHERE id = ?",
        [id]
      );
      return updatedLocation[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteLocation(id) {
    try {
      await db.query("DELETE FROM locations WHERE id = ?", [id]);
      const [Location] = await db.query(
        "SELECT * FROM locations WHERE id = ?",
        [id]
      );
      if (Location.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Location;
