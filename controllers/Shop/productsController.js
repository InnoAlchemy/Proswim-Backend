const express = require("express");
const Product = require("../../models/Shop/Product");
const router = express.Router();

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    if (products.length > 0) {
      const formattedProducts = products.map((product) => ({
        ...product,
        colors: JSON.parse(product.colors),
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
    const {
      title,
      description,
      price,
      colors,
      product_info,
      gender,
      brand,
      sport,
      category,
    } = req.body;

    const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);

    const data = await Product.createProduct(
      title,
      description,
      price,
      parsedColors,
      product_info,
      gender,
      brand,
      sport,
      category
    );

    if (data) {
      data.colors = JSON.parse(data.colors);
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
    } = req.body;

    const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);

    const product = await Product.updateProduct(
      id,
      title,
      description,
      price,
      parsedColors,
      product_info,
      gender,
      brand,
      sport,
      category
    );
    if (product) {
      product.colors = JSON.parse(product.colors);
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
    const { brand, sport, category, gender } = req.query;
    const filters = { brand, sport, category, gender };

    const filteredProducts = await Product.filterProducts(filters);
    if (filteredProducts.length > 0) {
      const formattedProducts = filteredProducts.map((product) => ({
        ...product,
        colors: JSON.parse(product.colors),
      }));
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
