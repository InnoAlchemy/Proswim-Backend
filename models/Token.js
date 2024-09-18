const db = require("../config/db");
class Token {
  static async createToken(email, resetToken, expiryTime) {
    try {
      const [token] = await db.query(
        "INSERT INTO tokens (email, resetToken, expiryTime) VALUES (?,?,?)",
        [email, resetToken, expiryTime]
      );
      return token.resetToken;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Token;
