const express = require("express");
const router = express.Router();
const propertyDetailController = require("../controllers/propertyDetailController");

// CRUD Routes
router.get("/", propertyDetailController.getAllProperties);
router.get("/:id", propertyDetailController.getPropertyById);
router.get("/byagency/:id", propertyDetailController.getPropertiesByAgency)
router.post("/", propertyDetailController.createProperty);
router.put("/:id", propertyDetailController.updateProperty);
router.delete("/:id", propertyDetailController.deleteProperty);
router.patch("/verify/:id", propertyDetailController.verifyProperty);

module.exports = router;