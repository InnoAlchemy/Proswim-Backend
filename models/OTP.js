const db = require("../config/db");

const OTP = {
  async createOtp(email, otp, expiresAt) {
    const query = "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)";
    return db.query(query, [email, otp, expiresAt]);
  },

  async findOtpByEmail(email) {
    const query =
      "SELECT * FROM otps WHERE email = ? ORDER BY expires_at DESC LIMIT 1";
    const [rows] = await db.query(query, [email]);
    return rows[0];
  },

  async deleteOtpByEmail(email) {
    const query = "DELETE FROM otps WHERE email = ?";
    return db.query(query, [email]);
  },
};

module.exports = OTP;
