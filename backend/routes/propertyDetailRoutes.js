const express = require("express");
const router = express.Router();
const propertyDetailController = require("../controllers/propertyDetailController");
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
// router.use(authMiddleware);
// CRUD Routes
router.get("/", propertyDetailController.getAllProperties);
router.get("/:id", authMiddleware, propertyDetailController.getPropertyById);
router.get("/byagency/:id", authMiddleware, propertyDetailController.getPropertiesByAgency)
router.post("/", authMiddleware, propertyDetailController.createProperty);
router.put("/:id", authMiddleware, propertyDetailController.updateProperty);
router.delete("/:id", authMiddleware, propertyDetailController.deleteProperty);
router.patch("/verify/:id", authMiddleware, propertyDetailController.verifyProperty);

module.exports = router;