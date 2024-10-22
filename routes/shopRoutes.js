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
const upload = require("../helper/uploadHandler");
const verifyToken = require("../middlewares/authMiddleware");

// Product routes
router.get("/products", productsController.getProducts);
router.get("/products/filter", productsController.filterProducts);
router.post("/products", upload.any(), productsController.addProduct);
router.put("/products/:id", upload.any(), productsController.updateProduct);
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
router.get("/cart", verifyToken, cartController.getCartItems);
router.post("/cart", verifyToken, cartController.addCartItem);
router.put("/cart/:id", verifyToken, cartController.updateCartItem);
router.delete("/cart/:id", verifyToken, cartController.deleteCartItem);

// Payment routes
router.post("/payment", verifyToken, paymentsController.createPayment);
router.get("/payment/:id", verifyToken, paymentsController.getPayment);
router.delete("/payment/:id", verifyToken, paymentsController.deletePayment);

// Order routes
router.post("/orders", verifyToken, ordersController.createOrder);
router.get("/orders", ordersController.getAllOrders);
router.get("/get-order", ordersController.getOrder);
router.get("/user-order", ordersController.getUserOrders);
router.delete("/orders/:id", verifyToken, ordersController.deleteOrder);

module.exports = router;
