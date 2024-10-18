const db = require("../../config/db");

class Product {
  static async getAllProducts() {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT cat.title) AS categories, 
          GROUP_CONCAT(DISTINCT pc.color_id) AS colors, 
          GROUP_CONCAT(DISTINCT pc.images) AS color_images, 
          GROUP_CONCAT(DISTINCT g.title) AS genders,
          b.title AS brand,
          s.title AS sport
        FROM products p
        LEFT JOIN product_categories pc2 ON p.id = pc2.product_id
        LEFT JOIN categories cat ON pc2.category_id = cat.id
        LEFT JOIN product_genders pg ON p.id = pg.product_id
        LEFT JOIN genders g ON pg.gender_id = g.id
        LEFT JOIN product_colors pc ON p.id = pc.product_id
        LEFT JOIN brands b ON p.brand = b.id
        LEFT JOIN sports s ON p.sport = s.id
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
    price_usd,
    price_lbp,
    coloredImages,
    nullColorImages,
    product_info,
    genders,
    brand,
    sport,
    categories,
    stock
  ) {
    try {
      const [result] = await db.query(
        "INSERT INTO products (title, description, price_usd, price_lbp, product_info, brand, sport, images, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          price_usd,
          price_lbp,
          product_info,
          brand,
          sport,
          JSON.stringify(nullColorImages), // Store only the array of images
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
      if (coloredImages) {
        for (const { color, images } of coloredImages) {
          await db.query(
            "INSERT INTO product_colors (product_id, color_id, images) VALUES (?, ?, ?)",
            [newProductId, color, JSON.stringify(images)]
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
        `
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT c.category_id) AS categories, 
          GROUP_CONCAT(DISTINCT col.color_id) AS colors, 
          GROUP_CONCAT(DISTINCT g.gender_id) AS genders
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        WHERE p.id = ?   -- Filtering by specific product ID
        GROUP BY p.id
        `,
        [newProductId] // Use the product ID as the parameter
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
    price_usd,
    price_lbp,
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
      // Update product details
      let query =
        "UPDATE products SET title = ?, description = ?, price_usd = ?, price_lbp = ?,  product_info = ?, brand = ?, sport = ?, stock = ?";
      const queryParams = [
        title,
        description,
        price_usd,
        price_lbp,
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
      if (categories) {
        for (const category of categories) {
          await db.query(
            "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
            [id, category]
          );
        }
      }

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
      if (genders) {
        for (const gender of genders) {
          await db.query(
            "INSERT INTO product_genders (product_id, gender_id) VALUES (?, ?)",
            [id, gender]
          );
        }
      }

      const [updatedProduct] = await db.query(
        `
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT c.category_id) AS categories, 
          GROUP_CONCAT(DISTINCT col.color_id) AS colors, 
          GROUP_CONCAT(DISTINCT g.gender_id) AS genders
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        WHERE p.id = ?   -- Filtering by specific product ID
        GROUP BY p.id
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
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT c.category_id) AS categories, 
          GROUP_CONCAT(DISTINCT col.color_id) AS colors, 
          GROUP_CONCAT(DISTINCT g.gender_id) AS genders
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_colors col ON p.id = col.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        WHERE 1=1
      `;
      const queryParams = [];
      console.log(filters); //

      if (brand && brand.length > 0) {
        query += ` AND p.brand IN (${brand.map(() => "?").join(",")})`;
        queryParams.push(...brand);
      }
      if (sport && sport.length > 0) {
        query += ` AND p.sport IN (${sport.map(() => "?").join(",")})`;
        queryParams.push(...sport);
      }
      if (category && category.length > 0) {
        query += ` AND c.category_id IN (${category.map(() => "?").join(",")})`;
        queryParams.push(...category);
      }
      if (gender && gender.length > 0) {
        query += ` AND g.gender_id IN (${gender.map(() => "?").join(",")})`;
        queryParams.push(...gender);
      }

      query += " GROUP BY p.id";

      const [rows] = await db.query(query, queryParams);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async checkIdsExist({
    categoryIds = [],
    brandIds = [],
    sportIds = [],
    genderIds = [],
  }) {
    try {
      const missing = {
        categories: [],
        brands: [],
        sports: [],
        genders: [],
      };

      const checkIds = async (ids, tableName, key) => {
        if (ids.length > 0) {
          const idsToCheck = ids.map((id) => parseInt(id, 10));
          console.log("Checking IDs in", tableName, ":", idsToCheck);

          const [rows] = await db.query(
            `SELECT id FROM ${tableName} WHERE id IN (${idsToCheck
              .map(() => "?")
              .join(",")})`,
            idsToCheck
          );

          const foundIds = new Set(rows.map((row) => row.id));
          missing[key] = idsToCheck.filter((id) => !foundIds.has(id));
        }
      };

      await Promise.all([
        checkIds(categoryIds, "categories", "categories"),
        checkIds(brandIds, "brands", "brands"),
        checkIds(sportIds, "sports", "sports"),
        checkIds(genderIds, "genders", "genders"),
      ]);

      return missing;
    } catch (err) {
      console.error("Error checking IDs:", err);
      throw new Error("Failed to check IDs");
    }
  }
}
module.exports = Product;
