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

    const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);
    const parsedImages = Array.isArray(images) ? images : JSON.parse(images);
    const parsedGenders = Array.isArray(genders)
      ? genders
      : JSON.parse(genders);
    const parsedCategories = Array.isArray(categories)
      ? categories
      : JSON.parse(categories);

    const data = await Product.createProduct(
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

    if (data) {
      data.images = JSON.parse(data.images);
      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: [data],
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
    const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);
    const parsedImages = Array.isArray(images) ? images : JSON.parse(images);
    const parsedGenders = Array.isArray(genders)
      ? genders
      : JSON.parse(genders);
    const parsedCategories = Array.isArray(categories)
      ? categories
      : JSON.parse(categories);

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
      product.colors = JSON.parse(product.colors);
      product.images = JSON.parse(product.images);
      product.genders = JSON.parse(product.genders);
      product.categories = JSON.parse(product.categories);
      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: product,
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
    const { brand, sport, categories, genders, sortBy, sortOrder } = req.query;
    const filters = { brand, sport, categories, genders };

    const filteredProducts = await Product.filterProducts(filters);
    if (filteredProducts.length > 0) {
      const formattedProducts = filteredProducts.map((product) => ({
        ...product,
        colors: JSON.parse(product.colors),
        images: JSON.parse(product.images),
        genders: JSON.parse(product.genders),
        categories: JSON.parse(product.categories),
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
