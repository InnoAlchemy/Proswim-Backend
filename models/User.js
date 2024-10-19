const db = require("../config/db");

class User {
  static async findByEmail(email) {
    try {
      console.log(email);
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0];
    } catch (err) {
      console.log(err);
    }
  }

  static async createUser(email, passwordHash, verified, role) {
    try {
      const [result] = await db.query(
        "INSERT INTO users (email, password, is_verified, role) VALUES (?,?,?,?)",
        [email, passwordHash, verified, role]
      );
      console.log(result);
      return result.affectedRows;
    } catch (err) {
      console.error(err);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  static async getAllUsers() {
    try {
      const [rows] = await db.query("SELECT * FROM users");
      return rows;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = User;
