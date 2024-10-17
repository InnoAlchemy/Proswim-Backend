const express = require("express");
const Product = require("../../models/Shop/Product");
const router = express.Router();

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    if (products.length > 0) {
      const formattedProducts = products.map((product) => ({
        ...product,
        categories: [product.categories],
        colors: [product.colors],
        genders: [product.genders],
        images: JSON.parse(product.images),
      }));
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        data: formattedProducts,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No products found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const {
      title,
      description,
      price, // the price object or array
      colors,
      product_info,
      genders,
      brand,
      sport,
      categories,
      stock,
    } = req.body;

    // Parse fields if necessary
    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;
    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price;

    const priceInLBP = parsedPrice.find((p) => p.currency === "lbp")?.value;
    const priceInUSD = parsedPrice.find((p) => p.currency === "usd")?.value;

    const missingIds = await Product.checkIdsExist({
      categoryIds: parsedCategories,
      brandIds: [brand],
      sportIds: [sport],
      genderIds: parsedGenders,
    });

    if (
      missingIds.categories.length > 0 ||
      missingIds.brands.length > 0 ||
      missingIds.sports.length > 0 ||
      missingIds.genders.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Some provided IDs do not exist.",
        missingIds,
      });
    }

    const product = await Product.createProduct(
      title,
      description,
      priceInLBP,
      priceInUSD,
      parsedColors,
      product_info,
      parsedGenders,
      brand,
      sport,
      parsedCategories,
      parsedImages,
      stock
    );

    if (product) {
      if (product) {
        const formattedProduct = {
          id: product.id, // Include the product ID
          product_info: [
            {
              title: product.title, // Keep title in product_info
              description: product.description, // Keep description in product_info
            },
          ],

          brand: product.brand, // Include brand ID
          sport: product.sport, // Include sport ID
          stock: product.stock, // Include stock quantity
          categories: [product.categories], // Include categories
          colors: [product.colors], // Include colors
          genders: [product.genders], // Include genders
          images: JSON.parse(product.images), // Parse images array
          price: [
            {
              currency: "lbp",
              value: product.price_lbp, // Keep LBP price
            },
            {
              currency: "usd",
              value: product.price_usd, // Keep USD price
            },
          ],
          created_at: product.created_at, // Include creation timestamp
          updated_at: product.updated_at, // Include update timestamp
        };

        res.status(201).json({
          success: true,
          message: "Product created successfully.",
          data: [formattedProduct],
        });
      } else {
        res.status(400).json({
          error: true,
          message: "Error creating product.",
        });
      }
    } else {
      res.status(400).json({
        error: true,
        message: "Error creating product.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const {
      title,
      description,
      price, // the price object or array
      colors,
      product_info,
      genders,
      brand,
      sport,
      categories,
      stock,
    } = req.body;

    const { id } = req.params;

    // Parse fields if necessary
    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;
    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price;

    const priceInLBP = parsedPrice.find((p) => p.currency === "lbp")?.value;
    const priceInUSD = parsedPrice.find((p) => p.currency === "usd")?.value;

    const missingIds = await Product.checkIdsExist({
      categoryIds: parsedCategories,
      brandIds: [brand],
      sportIds: [sport],
      genderIds: parsedGenders,
    });

    if (
      missingIds.categories.length > 0 ||
      missingIds.brands.length > 0 ||
      missingIds.sports.length > 0 ||
      missingIds.genders.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Some provided IDs do not exist.",
        missingIds,
      });
    }

    const product = await Product.updateProduct(
      id,
      title,
      description,
      priceInLBP,
      priceInUSD,
      parsedColors,
      product_info,
      parsedGenders,
      brand,
      sport,
      parsedCategories,
      parsedImages,
      stock
    );

    if (product) {
      const formattedProduct = {
        id: product.id, // Include the product ID
        product_info: [
          {
            title: product.title, // Keep title in product_info
            description: product.description, // Keep description in product_info
          },
        ],

        brand: product.brand, // Include brand ID
        sport: product.sport, // Include sport ID
        stock: product.stock, // Include stock quantity
        categories: [product.categories], // Include categories
        colors: [product.colors], // Include colors
        genders: [product.genders], // Include genders
        images: JSON.parse(product.images), // Parse images array
        price: [
          {
            currency: "lbp",
            value: product.price_lbp, // Keep LBP price
          },
          {
            currency: "usd",
            value: product.price_usd, // Keep USD price
          },
        ],
        created_at: product.created_at, // Include creation timestamp
        updated_at: product.updated_at, // Include update timestamp
      };

      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: [formattedProduct],
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error updating product.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.deleteProduct(id);
    if (product) {
      res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error deleting product.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const filters = ({ brand, sport, categories, genders, sortBy, sortOrder } =
      req.query);

    const filteredProducts = await Product.filterProducts(filters);
    if (filteredProducts.length > 0) {
      const formattedProducts = filteredProducts.map((product) => ({
        ...product,
        categories: [product.categories],
        colors: [product.colors],
        genders: [product.genders],
        images: JSON.parse(product.images),
      }));

      if (sortBy) {
        formattedProducts.sort((a, b) => {
          if (sortBy === "alphabetical") {
            return sortOrder === "desc"
              ? b.title.localeCompare(a.title)
              : a.title.localeCompare(b.title);
          } else if (sortBy === "price") {
            return sortOrder === "desc" ? b.price - a.price : a.price - b.price;
          } else if (sortBy === "date") {
            return sortOrder === "desc"
              ? new Date(b.createdAt) - new Date(a.createdAt)
              : new Date(a.createdAt) - new Date(b.createdAt);
          }
          return 0;
        });
      }

      res.status(200).json({
        success: true,
        message: "Filtered products retrieved successfully.",
        data: formattedProducts,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No products found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
