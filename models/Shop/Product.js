const db = require("../../config/db");

class Product {
  static async getAllProducts() {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT c.category_id) AS categories, 
          GROUP_CONCAT(DISTINCT col.color_id) AS colors, 
          GROUP_CONCAT(DISTINCT g.gender_id) AS genders
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        GROUP BY p.id
      `);
      return rows;
    } catch (err) {
      throw err;
    }
  }
  static async getProduct(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT p.*, c.category_id, col.color_id, g.gender_id 
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        WHERE p.id = ?
      `,
        [id]
      );

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
    genders,
    brand,
    sport,
    categories,
    images,
    stock
  ) {
    try {
      const [result] = await db.query(
        "INSERT INTO products (title, description, price, product_info, brand, sport, images, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          price,
          product_info,
          brand,
          sport,
          JSON.stringify(images),
          stock,
        ]
      );
      const newProductId = result.insertId;

      // Insert into related tables
      if (categories) {
        for (const category of categories) {
          await db.query(
            "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
            [newProductId, category]
          );
        }
      }
      if (colors) {
        for (const color of colors) {
          await db.query(
            "INSERT INTO product_colors (product_id, color_id) VALUES (?, ?)",
            [newProductId, color]
          );
        }
      }
      if (genders) {
        for (const gender of genders) {
          await db.query(
            "INSERT INTO product_genders (product_id, gender_id) VALUES (?, ?)",
            [newProductId, gender]
          );
        }
      }

      const [newProduct] = await db.query(
        "SELECT p.*, c.category_id, col.color_id, g.gender_id FROM products p LEFT JOIN product_categories c ON p.id = c.product_id LEFT JOIN product_colors col ON p.id = col.product_id LEFT JOIN product_genders g ON p.id = g.product_id WHERE p.id = ?",
        [newProductId]
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
    category,
    images,
    stock
  ) {
    try {
      // Update product details
      let query =
        "UPDATE products SET title = ?, description = ?, price = ?, product_info = ?, brand = ?, sport = ?, stock = ?";
      const queryParams = [
        title,
        description,
        price,
        product_info,
        brand,
        sport,
        stock,
        id,
      ];

      if (images !== null) {
        query += ", images = ?";
        queryParams.splice(queryParams.length - 1, 0, JSON.stringify(images));
      }

      query += " WHERE id = ?";
      await db.query(query, queryParams);

      // Update related tables
      await db.query("DELETE FROM product_categories WHERE product_id = ?", [
        id,
      ]);
      await db.query(
        "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
        [id, category]
      );

      await db.query("DELETE FROM product_colors WHERE product_id = ?", [id]);
      if (colors) {
        for (const color of colors) {
          await db.query(
            "INSERT INTO product_colors (product_id, color_id) VALUES (?, ?)",
            [id, color]
          );
        }
      }

      await db.query("DELETE FROM product_genders WHERE product_id = ?", [id]);
      if (gender) {
        await db.query(
          "INSERT INTO product_genders (product_id, gender_id) VALUES (?, ?)",
          [id, gender]
        );
      }

      const [updatedProduct] = await db.query(
        `
        SELECT p.*, c.category_id, col.color_id, g.gender_id 
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        WHERE p.id = ?
      `,
        [id]
      );
      return updatedProduct[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteProduct(id) {
    try {
      await db.query("DELETE FROM product_genders WHERE product_id = ?", [id]);
      await db.query("DELETE FROM product_colors WHERE product_id = ?", [id]);
      await db.query("DELETE FROM product_categories WHERE product_id = ?", [
        id,
      ]);
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
      let query = `
        SELECT p.*, c.category_id, col.color_id, g.gender_id 
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        WHERE 1=1
      `;
      const queryParams = [];

      if (brand) {
        query += " AND p.brand = ?";
        queryParams.push(brand);
      }
      if (sport) {
        query += " AND p.sport = ?";
        queryParams.push(sport);
      }
      if (category) {
        query += " AND c.category_id = ?";
        queryParams.push(category);
      }
      if (gender) {
        query += " AND g.gender_id = ?";
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
