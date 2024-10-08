const db = require("../../config/db");

class Product {
  static async getAllProducts() {
    try {
      const [rows] = await db.query("SELECT * FROM products");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getProduct(id) {
    try {
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        throw new Error("Product not found");
      }
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createProduct(
    title,
    description,
    price,
    colors,
    product_info,
    gender,
    brand,
    sport,
    category
  ) {
    try {
      await db.query(
        "INSERT INTO products ( title, description, price, colors, product_info, gender, brand, sport, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          price,
          JSON.stringify(colors),
          product_info,
          gender,
          brand,
          sport,
          category,
        ]
      );
      const [newProduct] = await db.query(
        "SELECT * FROM products WHERE id = LAST_INSERT_ID()"
      );
      return newProduct[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateProduct(
    id,
    title,
    description,
    price,
    colors,
    product_info,
    gender,
    brand,
    sport,
    category
  ) {
    try {
      await db.query(
        "UPDATE products SET title = ?, description = ?, price = ?, colors = ?, product_info = ?, gender = ?, brand = ?, sport = ?, category = ? WHERE id = ?",
        [
          title,
          description,
          price,
          JSON.stringify(colors),
          product_info,
          gender,
          brand,
          sport,
          category,
          id,
        ]
      );
      const [updatedProduct] = await db.query(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );
      return updatedProduct[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteProduct(id) {
    try {
      await db.query("DELETE FROM products WHERE id = ?", [id]);
      const [product] = await db.query("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      if (product.length === 0) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  static async filterProducts(filters) {
    try {
      const { brand, sport, category, gender } = filters;
      let query = "SELECT * FROM products WHERE 1=1";
      const queryParams = [];

      if (brand) {
        query += " AND brand = ?";
        queryParams.push(brand);
      }
      if (sport) {
        query += " AND sport = ?";
        queryParams.push(sport);
      }
      if (category) {
        query += " AND category = ?";
        queryParams.push(category);
      }
      if (gender) {
        query += " AND gender = ?";
        queryParams.push(gender);
      }

      const [rows] = await db.query(query, queryParams);
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
