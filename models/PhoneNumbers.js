const db = require("../config/db");

class PhoneNumbers {
  static async getAllPhoneNumbers() {
    try {
      const [rows] = await db.query("SELECT * FROM phone_numbers");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getPhoneNumber(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM phone_numbers WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Phone number not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createPhoneNumber(phone_number, is_active) {
    try {
      await db.query(
        "INSERT INTO phone_numbers (phone_number, is_active) VALUES (?, ?)",
        [phone_number, is_active]
      );
      const [newPhoneNumber] = await db.query(
        "SELECT * FROM phone_numbers WHERE id = LAST_INSERT_ID()"
      );
      return newPhoneNumber[0];
    } catch (err) {
      throw err;
    }
  }

  static async updatePhoneNumber(id, phone_number, is_active) {
    try {
      await db.query(
        "UPDATE phone_numbers SET phone_number = ?, is_active = ? WHERE id = ?",
        [phone_number, is_active, id]
      );
      const [updatedPhoneNumber] = await db.query(
        "SELECT * FROM phone_numbers WHERE id = ?",
        [id]
      );
      return updatedPhoneNumber[0];
    } catch (err) {
      throw err;
    }
  }

  static async deletePhoneNumber(id) {
    try {
      await db.query("DELETE FROM phone_numbers WHERE id = ?", [id]);
      const [phoneNumber] = await db.query(
        "SELECT * FROM phone_numbers WHERE id = ?",
        [id]
      );
      if (phoneNumber.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PhoneNumbers;
