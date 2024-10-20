const express = require("express");
const Product = require("../../models/Shop/Product");
const router = express.Router();

exports.getProducts = async (req, res) => {
  try {
    const { product_id } = req.body;
    let products;

    if (product_id) {
      const product = await Product.getProductById(product_id);
      products = product ? [product] : [];
    } else {
      products = await Product.getAllProducts();
    }

    if (products.length > 0) {
      const formattedProducts = products.map((product) => ({
        id: product.id, // Include the product ID
        title: product.title,
        description: product.description,
        ...product,
        product_info: JSON.parse(`[${product.product_info}]`), // Convert string to JSON array
        brand: product.brand, // Include brand ID
        sport: product.sport, // Include sport ID
        stock: product.stock, // Include stock quantity
        categories: [product.categories], // Include categories
        genders: [product.genders], // Include genders
        sizes: JSON.parse(`[${product.sizes}]`),

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
exports.getFormattedProducts = async () => {
  try {
    const products = await Product.getAllProducts();
    if (products.length > 0) {
      const formattedProducts = products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        ...product,
        product_info: JSON.parse(`[${product.product_info}]`),
        brand: product.brand,
        sport: product.sport,
        stock: product.stock,
        categories: [product.categories],
        genders: [product.genders],
        sizes: JSON.parse(`[${product.sizes}]`),
        images: JSON.parse(product.images),
        price: [
          {
            currency: "lbp",
            value: product.price_lbp,
          },
          {
            currency: "usd",
            value: product.price_usd,
          },
        ],
        created_at: product.created_at,
        updated_at: product.updated_at,
      }));
      return {
        formattedProducts,
      };
    } else {
      return {
        data: [],
      };
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const images = req.files || [];
    const {
      title,
      description,
      price,
      product_info,
      genders,
      brand,
      sport,
      categories,
      stock,
      sizes,
      images: bodyImages,
    } = req.body;

    // Parse fields if necessary
    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price;
    const priceInLBP = parsedPrice.find((p) => p.currency === "lbp")?.value;
    const priceInUSD = parsedPrice.find((p) => p.currency === "usd")?.value;

    // Initialize Map for image grouping and Set for tracking assigned images
    const allImagesMap = new Map();
    const assignedImages = new Set();

    // Loop through body images and group them by their colors
    bodyImages.forEach((bodyImage, index) => {
      const color = bodyImage.color || null; // Default to null if no color
      const imageFilenames = images
        .filter((file) => file.fieldname === `images[${index}][image]`)
        .map((file) => file.filename);

      if (imageFilenames.length > 0) {
        if (!allImagesMap.has(color)) {
          allImagesMap.set(color, []);
        }
        allImagesMap.get(color).push(...imageFilenames);
        imageFilenames.forEach((filename) => assignedImages.add(filename));
      }
    });

    // Prepare separate arrays for colored and null color images
    const coloredImages = [];
    const nullColorImages = [];

    // Populate the colored and null color arrays
    allImagesMap.forEach((image, color) => {
      if (color === null) {
        nullColorImages.push(...image); // Directly push images to nullColorImages
      } else {
        coloredImages.push({
          color,
          images: image,
        });
      }
    });

    // Add any images that haven't been assigned to a color to nullColorImages
    const unassignedImages = images
      .filter((file) => !assignedImages.has(file.filename))
      .map((file) => file.filename);

    if (unassignedImages.length > 0) {
      nullColorImages.push(...unassignedImages); // Directly push images to nullColorImages
    }

    // Combine coloredImages and nullColorImages into the desired output format
    const combinedImages = {
      generic: nullColorImages, // Uncolored images
      colored: coloredImages, // Colored images
    };

    // Log the output in the desired format
    console.log(combinedImages);

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
      combinedImages,
      product_info,
      parsedGenders,
      brand,
      sport,
      parsedCategories,
      stock,
      parsedSizes
    );

    if (product) {
      const formattedProduct = {
        id: product.id,
        title: product.title,
        description: product.description,
        brand: product.brand,
        sport: product.sport,
        stock: product.stock,
        product_info: JSON.parse(`[${product.product_info}]`),
        categories: [product.categories],
        genders: [product.genders],
        sizes: JSON.parse(`[${product.sizes}]`),

        images: JSON.parse(product.images),
        price: [
          {
            currency: "lbp",
            value: product.price_lbp,
          },
          {
            currency: "usd",
            value: product.price_usd,
          },
        ],
        created_at: product.created_at,
        updated_at: product.updated_at,
      };

      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: [formattedProduct],
      });
    } else {
      res.status(400).json({ error: true, message: "Error creating product." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const images = req.files || [];
    const {
      title,
      description,
      price,
      product_info,
      genders,
      brand,
      sport,
      categories,
      stock,
      sizes,
      images: bodyImages,
    } = req.body;

    const { id } = req.params;

    // Parse fields if necessary
    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;

    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price;
    const priceInLBP = parsedPrice.find((p) => p.currency === "lbp")?.value;
    const priceInUSD = parsedPrice.find((p) => p.currency === "usd")?.value;

    // Initialize Map for image grouping and Set for tracking assigned images
    const allImagesMap = new Map();
    const assignedImages = new Set();

    // Loop through body images and group them by their colors
    bodyImages.forEach((bodyImage, index) => {
      const color = bodyImage.color || null; // Default to null if no color
      const imageFilenames = images
        .filter((file) => file.fieldname === `images[${index}][image]`)
        .map((file) => file.filename);

      if (imageFilenames.length > 0) {
        if (!allImagesMap.has(color)) {
          allImagesMap.set(color, []);
        }
        allImagesMap.get(color).push(...imageFilenames);
        imageFilenames.forEach((filename) => assignedImages.add(filename));
      }
    });

    // Prepare separate arrays for colored and null color images
    const coloredImages = [];
    const nullColorImages = [];

    // Populate the colored and null color arrays
    allImagesMap.forEach((image, color) => {
      if (color === null) {
        nullColorImages.push(...image); // Directly push images to nullColorImages
      } else {
        coloredImages.push({
          color,
          images: image,
        });
      }
    });

    // Add any images that haven't been assigned to a color to nullColorImages
    const unassignedImages = images
      .filter((file) => !assignedImages.has(file.filename))
      .map((file) => file.filename);

    if (unassignedImages.length > 0) {
      nullColorImages.push(...unassignedImages); // Directly push images to nullColorImages
    }

    // Combine coloredImages and nullColorImages into the desired output format
    const combinedImages = {
      generic: nullColorImages, // Uncolored images
      colored: coloredImages, // Colored images
    };

    // Log the output in the desired format
    console.log(combinedImages);

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
      combinedImages,
      product_info,
      parsedGenders,
      brand,
      sport,
      parsedCategories,
      stock,
      sizes
    );

    if (product) {
      const formattedProduct = {
        id: product.id,
        title: product.title,
        description: product.description,
        brand: product.brand,
        sport: product.sport,
        stock: product.stock,
        product_info: JSON.parse(`[${product.product_info}]`),
        categories: [product.categories],
        genders: [product.genders],
        sizes: JSON.parse(`[${product.sizes}]`),

        images: JSON.parse(product.images),
        price: [
          {
            currency: "lbp",
            value: product.price_lbp,
          },
          {
            currency: "usd",
            value: product.price_usd,
          },
        ],
        created_at: product.created_at,
        updated_at: product.updated_at,
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
