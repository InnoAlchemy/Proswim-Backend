const db = require("../../config/db");

class Product {
  static async getAllProducts() {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*, 
          b.id AS brand_id,
          b.title AS brand,
          s.id AS sport_id,
          s.title AS sport,
          CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('title', pi.title, 'description', pi.description)), ']') AS product_info
        FROM products p
        LEFT JOIN product_categories pc2 ON p.id = pc2.product_id
        LEFT JOIN categories cat ON pc2.category_id = cat.id
        LEFT JOIN product_genders pg ON p.id = pg.product_id
        LEFT JOIN genders g ON pg.gender_id = g.id
        LEFT JOIN product_colors pc ON p.id = pc.product_id
        LEFT JOIN brands b ON p.brand = b.id
        LEFT JOIN sports s ON p.sport = s.id
        LEFT JOIN product_info pi ON p.id = pi.product_id
        GROUP BY p.id
      `);

      const productIds = rows.map((row) => row.id);

      const [categories] = await db.query(
        `
        SELECT pc2.product_id, cat.id AS category_id, cat.title AS category_title
        FROM product_categories pc2
        JOIN categories cat ON pc2.category_id = cat.id
        WHERE pc2.product_id IN (?)
      `,
        [productIds]
      );

      const [genders] = await db.query(
        `
        SELECT pg.product_id, g.id AS gender_id, g.title AS gender_title
        FROM product_genders pg
        JOIN genders g ON pg.gender_id = g.id
        WHERE pg.product_id IN (?)
      `,
        [productIds]
      );

      const products = rows.map((product) => {
        return {
          ...product,
          categories: categories
            .filter((cat) => cat.product_id === product.id)
            .map((cat) => ({ id: cat.category_id, title: cat.category_title })),
          genders: genders
            .filter((gen) => gen.product_id === product.id)
            .map((gen) => ({ id: gen.gender_id, title: gen.gender_title })),
        };
      });

      return products;
    } catch (err) {
      throw err;
    }
  }

  static async getProductById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          p.*, 
          b.id AS brand_id,
          b.title AS brand,
          s.id AS sport_id,
          s.title AS sport,
          CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('title', pi.title, 'description', pi.description)), ']') AS product_info
        FROM products p
        LEFT JOIN product_categories pc2 ON p.id = pc2.product_id
        LEFT JOIN categories cat ON pc2.category_id = cat.id
        LEFT JOIN product_genders pg ON p.id = pg.product_id
        LEFT JOIN genders g ON pg.gender_id = g.id
        LEFT JOIN product_colors pc ON p.id = pc.product_id
        LEFT JOIN brands b ON p.brand = b.id
        LEFT JOIN sports s ON p.sport = s.id
        LEFT JOIN product_info pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id
        `,
        [id]
      );

      const productId = rows[0].id;

      const [categories] = await db.query(
        `
        SELECT pc2.product_id, cat.id AS category_id, cat.title AS category_title
        FROM product_categories pc2
        JOIN categories cat ON pc2.category_id = cat.id
        WHERE pc2.product_id = ?
        `,
        [productId]
      );

      const [genders] = await db.query(
        `
        SELECT pg.product_id, g.id AS gender_id, g.title AS gender_title
        FROM product_genders pg
        JOIN genders g ON pg.gender_id = g.id
        WHERE pg.product_id = ?
        `,
        [productId]
      );

      const product = {
        ...rows[0],
        categories: categories.map((cat) => ({
          id: cat.category_id,
          title: cat.category_title,
        })),
        genders: genders.map((gen) => ({
          id: gen.gender_id,
          title: gen.gender_title,
        })),
      };

      return product;
    } catch (err) {
      throw err;
    }
  }

  static async getProduct(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          p.*, 
          b.id AS brand_id,
          b.title AS brand,
          s.id AS sport_id,
          s.title AS sport,
          CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('title', pi.title, 'description', pi.description)), ']') AS product_info
        FROM products p
        LEFT JOIN product_categories pc2 ON p.id = pc2.product_id
        LEFT JOIN categories cat ON pc2.category_id = cat.id
        LEFT JOIN product_genders pg ON p.id = pg.product_id
        LEFT JOIN genders g ON pg.gender_id = g.id
        LEFT JOIN product_colors pc ON p.id = pc.product_id
        LEFT JOIN brands b ON p.brand = b.id
        LEFT JOIN sports s ON p.sport = s.id
        LEFT JOIN product_info pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id
        `,
        [id]
      );

      const productId = rows[0].id;

      const [categories] = await db.query(
        `
        SELECT pc2.product_id, cat.id AS category_id, cat.title AS category_title
        FROM product_categories pc2
        JOIN categories cat ON pc2.category_id = cat.id
        WHERE pc2.product_id = ?
        `,
        [productId]
      );

      const [genders] = await db.query(
        `
        SELECT pg.product_id, g.id AS gender_id, g.title AS gender_title
        FROM product_genders pg
        JOIN genders g ON pg.gender_id = g.id
        WHERE pg.product_id = ?
        `,
        [productId]
      );

      const product = {
        ...rows[0],
        categories: categories.map((cat) => ({
          id: cat.category_id,
          title: cat.category_title,
        })),
        genders: genders.map((gen) => ({
          id: gen.gender_id,
          title: gen.gender_title,
        })),
      };

      return product;
    } catch (err) {
      throw err;
    }
  }

  static async createProduct(
    title,
    description,
    price_usd,
    price_lbp,
    combinedImages,
    product_info,
    genders,
    brand,
    sport,
    categories,
    stock,
    sizes
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        "INSERT INTO products (title, description, price_usd, price_lbp, brand, sport, images, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          price_usd,
          price_lbp,
          brand,
          sport,
          JSON.stringify(combinedImages), // Store only the array of images
          JSON.stringify(sizes),
          stock,
        ]
      );
      const newProductId = result.insertId;

      // Insert into related tables
      if (categories) {
        for (const category of categories) {
          await connection.query(
            "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
            [newProductId, category]
          );
        }
      }
      if (genders) {
        for (const gender of genders) {
          await connection.query(
            "INSERT INTO product_genders (product_id, gender_id) VALUES (?, ?)",
            [newProductId, gender]
          );
        }
      }

      if (product_info && Array.isArray(product_info)) {
        for (const info of product_info) {
          const parsedInfo = JSON.parse(info);
          await connection.query(
            "INSERT INTO product_info (product_id, title, description) VALUES (?, ?, ?)",
            [newProductId, parsedInfo.title, parsedInfo.description]
          );
        }
      }

      const [newProduct] = await connection.query(
        `
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT c.category_id) AS categories, 
          GROUP_CONCAT(DISTINCT g.gender_id) AS genders,
          GROUP_CONCAT(DISTINCT JSON_OBJECT('title', pi.title, 'description', pi.description)) AS product_info,
          b.title AS brand,
          s.title AS sport
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        LEFT JOIN product_info pi ON p.id = pi.product_id
        LEFT JOIN brands b ON p.brand = b.id
        LEFT JOIN sports s ON p.sport = s.id
        WHERE p.id = ?   -- Filtering by specific product ID
        GROUP BY p.id
        `,
        [newProductId] // Use the product ID as the parameter
      );

      await connection.commit();
      return newProduct[0];
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async updateProduct(
    id,
    title,
    description,
    price_lbp,
    price_usd,
    combinedImages,
    product_info,
    genders,
    brand,
    sport,
    categories,
    stock,
    sizes
  ) {
    try {
      // Update product details
      let query =
        "UPDATE products SET title = ?, description = ?, price_usd = ?, price_lbp = ?, brand = ?, sport = ?, images = ?, stock = ?, sizes = ? WHERE id = ?";
      const queryParams = [
        title,
        description,
        price_usd,
        price_lbp,
        brand,
        sport,
        JSON.stringify(combinedImages),
        stock,
        JSON.stringify(sizes),
        id,
      ];

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

      await db.query("DELETE FROM product_genders WHERE product_id = ?", [id]);
      if (genders) {
        for (const gender of genders) {
          await db.query(
            "INSERT INTO product_genders (product_id, gender_id) VALUES (?, ?)",
            [id, gender]
          );
        }
      }

      await db.query("DELETE FROM product_info WHERE product_id = ?", [id]);
      if (product_info && Array.isArray(product_info)) {
        for (const info of product_info) {
          const parsedInfo = JSON.parse(info);
          await db.query(
            "INSERT INTO product_info (product_id, title, description) VALUES (?, ?, ?)",
            [id, parsedInfo.title, parsedInfo.description]
          );
        }
      }

      const [updatedProduct] = await db.query(
        `
        SELECT 
          p.*, 
          GROUP_CONCAT(DISTINCT c.category_id) AS categories, 
          GROUP_CONCAT(DISTINCT g.gender_id) AS genders,
          GROUP_CONCAT(DISTINCT JSON_OBJECT('title', pi.title, 'description', pi.description)) AS product_info,
          b.title AS brand,
          s.title AS sport
        FROM products p
        LEFT JOIN product_categories c ON p.id = c.product_id
        LEFT JOIN product_genders g ON p.id = g.product_id
        LEFT JOIN product_info pi ON p.id = pi.product_id
        LEFT JOIN brands b ON p.brand = b.id
        LEFT JOIN sports s ON p.sport = s.id
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
