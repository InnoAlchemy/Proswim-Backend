const express = require("express");
const router = express.Router();
const productsController = require("../controllers/Shop/productsController");
const brandsController = require("../controllers/Shop/brandsController");
const sportsController = require("../controllers/Shop/sportsController");
const categoriesController = require("../controllers/Shop/categoriesController");
const gendersController = require("../controllers/Shop/gendersController");
const cartController = require("../controllers/Shop/cartController");
const paymentsController = require("../controllers/Shop/paymentsController");
const ordersController = require("../controllers/Shop/ordersController");

// Product routes
router.get("/products", productsController.getProducts);
router.get("/products/filter", productsController.filterProducts);
router.post("/products", productsController.addProduct);
router.put("/products/:id", productsController.updateProduct);
router.delete("/products/:id", productsController.deleteProduct);

// Brand routes
router.get("/brands", brandsController.getBrands);
router.post("/brands", brandsController.addBrand);
router.put("/brands/:id", brandsController.updateBrand);
router.delete("/brands/:id", brandsController.deleteBrand);

// Sport routes
router.get("/sports", sportsController.getSports);
router.post("/sports", sportsController.addSport);
router.put("/sports/:id", sportsController.updateSport);
router.delete("/sports/:id", sportsController.deleteSport);

// Category routes
router.get("/categories", categoriesController.getCategories);
router.post("/categories", categoriesController.addCategory);
router.put("/categories/:id", categoriesController.updateCategory);
router.delete("/categories/:id", categoriesController.deleteCategory);

// Gender routes
router.get("/genders", gendersController.getGenders);
router.post("/genders", gendersController.addGender);
router.put("/genders/:id", gendersController.updateGender);
router.delete("/genders/:id", gendersController.deleteGender);

// Cart routes
router.get("/cart", cartController.getCartItems);
router.post("/cart", cartController.addCartItem);
router.put("/cart", cartController.updateCartItem);
router.delete("/cart/:id", cartController.deleteCartItem);

// Payment routes
router.post("/payment", paymentsController.createPayment);
router.get("/payment/:id", paymentsController.getPayment);
router.delete("/payment/:id", paymentsController.deletePayment);

// Order routes
router.post("/orders", ordersController.createOrder);
router.get("/orders/:id", ordersController.getOrder);
router.delete("/orders/:id", ordersController.deleteOrder);

module.exports = router;