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

  static async createUser(id, email, passwordHash, verified, role) {
    try {
      const [result] = await db.query(
        "INSERT INTO users (id, email, password, is_verified, role) VALUES (?,?,?,?,?)",
        [id, email, passwordHash, verified, role]
      );
      return result.insertId;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = User;
