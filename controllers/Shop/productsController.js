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
      price,
      colors,
      product_info,
      genders,
      brand,
      sport,
      categories,
      stock,
    } = req.body;

    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;
    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;

    // Assuming createProduct returns a single product object
    const product = await Product.createProduct(
      title,
      description,
      price,
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
        ...product,
        categories: [product.categories],
        colors: [product.colors],
        genders: [product.genders],
        images: JSON.parse(product.images),
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      colors,
      product_info,
      genders,
      brand,
      sport,
      categories,
      stock,
    } = req.body;
    const { id } = req.params;

    const images = req.files ? req.files.map((file) => file.filename) : [];

    // Parse input values if they are stringified JSON
    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;
    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;

    // Assuming updateProduct returns the updated product object
    const product = await Product.updateProduct(
      id,
      title,
      description,
      price,
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
      // Format the product for consistent output
      const formattedProduct = {
        ...product,
        categories: Array.isArray(product.categories)
          ? product.categories
          : [product.categories],
        colors: Array.isArray(product.colors)
          ? product.colors
          : [product.colors],
        genders: Array.isArray(product.genders)
          ? product.genders
          : [product.genders],
        images: JSON.parse(product.images),
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
