const express = require("express");
const Product = require("../../models/Shop/Product");
const router = express.Router();

exports.getProducts = async (req, res) => {
  try {
    const { id } = req.query;
    let products;

    if (id) {
      const product = await Product.getProductById(id);
      products = product ? [product] : [];
    } else {
      products = await Product.getAllProducts();
    }

    if (products.length > 0) {
      const formattedProducts = products.map((product) => {
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          brand: {
            id: product.brand_id,
            title: product.brand,
          },
          sport: {
            id: product.sport_id,
            title: product.sport,
          },
          stock: product.stock,
          categories: product.categories,
          genders: product.genders,
          product_info: JSON.parse(product.product_info),
          sizes: JSON.parse(product.sizes),
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
      });
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
      const formattedProducts = products.map((product) => {
        const { price_lbp, price_usd, ...rest } = product;
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          ...rest,
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
              value: price_lbp,
            },
            {
              currency: "usd",
              value: price_usd,
            },
          ],
          created_at: product.created_at,
          updated_at: product.updated_at,
        };
      });
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

    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price;
    const priceInLBP = parsedPrice.find((p) => p.currency === "lbp")?.value;
    const priceInUSD = parsedPrice.find((p) => p.currency === "usd")?.value;

    const allImagesMap = new Map();
    const assignedImages = new Set();

    bodyImages.forEach((bodyImage, index) => {
      const color = bodyImage.color || null;
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

    const coloredImages = [];
    const nullColorImages = [];

    allImagesMap.forEach((image, color) => {
      if (color === null) {
        nullColorImages.push(...image);
      } else {
        coloredImages.push({
          color,
          images: image,
        });
      }
    });

    const unassignedImages = images
      .filter((file) => !assignedImages.has(file.filename))
      .map((file) => file.filename);

    if (unassignedImages.length > 0) {
      nullColorImages.push(...unassignedImages);
    }

    const combinedImages = {
      generic: nullColorImages,
      colored: coloredImages,
    };

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

    const parsedGenders =
      typeof genders === "string" ? JSON.parse(genders) : genders;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;

    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price;
    const priceInLBP = parsedPrice.find((p) => p.currency === "lbp")?.value;
    const priceInUSD = parsedPrice.find((p) => p.currency === "usd")?.value;

    const allImagesMap = new Map();
    const assignedImages = new Set();

    bodyImages.forEach((bodyImage, index) => {
      const color = bodyImage.color || null;
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

    const coloredImages = [];
    const nullColorImages = [];

    allImagesMap.forEach((image, color) => {
      if (color === null) {
        nullColorImages.push(...image);
      } else {
        coloredImages.push({
          color,
          images: image,
        });
      }
    });

    const unassignedImages = images
      .filter((file) => !assignedImages.has(file.filename))
      .map((file) => file.filename);

    if (unassignedImages.length > 0) {
      nullColorImages.push(...unassignedImages);
    }

    const combinedImages = {
      generic: nullColorImages,
      colored: coloredImages,
    };

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
    const {
      id,
      brand,
      sport,
      categories,
      genders,
      sizes,
      colors,
      sortBy,
      sortOrder,
    } = req.query;

    console.log(req.query);
    let products;

    if (id) {
      const product = await Product.getProductById(id);
      products = product ? [product] : [];
    } else {
      products = await Product.getAllProducts();
    }

    if (products.length > 0) {
      if (brand) {
        products = products.filter(
          (product) => product.brand_id === parseInt(brand)
        );
      }
      if (sport) {
        products = products.filter(
          (product) => product.sport_id === parseInt(sport)
        );
      }
      if (categories) {
        const categorySet = new Set(categories.map(String));
        products = products.filter((product) =>
          product.categories.some((category) =>
            categorySet.has(String(category.id))
          )
        );
      }
      if (genders) {
        const genderSet = new Set(genders.map(String));
        products = products.filter((product) =>
          product.genders.some((gender) => genderSet.has(String(gender.id)))
        );
      }

      if (sizes) {
        const sizeSet = new Set(sizes.map(String));
        products = products.filter((product) =>
          product.sizes.some((size) => sizeSet.has(String(size)))
        );
      }

      if (colors) {
        const colorSet = new Set(
          colors.map((color) => color.trim().toLowerCase())
        );
        console.log(colorSet);

        products = products.filter((product) => {
          return (
            (product.imgs = JSON.parse(product.images)),
            product.imgs &&
              product.imgs.colored &&
              product.imgs.colored.some((colored) =>
                colorSet.has(colored.color.trim().toLowerCase())
              )
          );
        });
      }

      if (sortBy) {
        products.sort((a, b) => {
          let comparison = 0;

          if (sortBy === "price") {
            comparison = a.price_lbp - b.price_lbp;
          } else {
            comparison = a[sortBy] > b[sortBy] ? 1 : -1;
          }

          return sortOrder === "asc" ? comparison : -comparison;
        });
      }

      const formattedProducts = products.map((product) => {
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          brand: {
            id: product.brand_id,
            title: product.brand,
          },
          sport: {
            id: product.sport_id,
            title: product.sport,
          },
          stock: product.stock,
          categories: product.categories,
          genders: product.genders,
          product_info: JSON.parse(product.product_info),
          sizes: JSON.parse(product.sizes),
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
      });

      res.status(200).json({
        success: true,
        message: "Products filtered and sorted successfully.",
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
