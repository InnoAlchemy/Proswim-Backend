const express = require("express");
const router = express.Router();
const phoneNumbersController = require("../controllers/Footer/phoneNumbersController");
const descriptionsController = require("../controllers/Footer/descriptionsController");
const socialLinksController = require("../controllers/Footer/socialLinksController");

// Routes for managing phone numbers
router.get("/phone-numbers", phoneNumbersController.getPhoneNumbers); // Get all phone numbers
router.post("/phone-numbers", phoneNumbersController.createPhoneNumber); // Create a new phone number
router.put("/phone-numbers/:id", phoneNumbersController.updatePhoneNumber); // Update a phone number by ID
router.delete("/phone-numbers/:id", phoneNumbersController.deletePhoneNumber); // Delete a phone number by ID

// Routes for managing descriptions
router.get("/description", descriptionsController.getDescription); // Get description
router.post("/description", descriptionsController.createDescription); // Create a new description
router.put("/description", descriptionsController.updateDescription); // Update description
router.delete("/description", descriptionsController.deleteDescription); // Delete description

// Routes for managing social links
router.get("/social-links", socialLinksController.getSocialLinks); // Get all social links
router.post("/social-links", socialLinksController.createSocialLink); // Create a new social link
router.put("/social-links/:id", socialLinksController.updateSocialLink); // Update a social link by ID
router.delete("/social-links/:id", socialLinksController.deleteSocialLink); // Delete a social link by ID

module.exports = router;
