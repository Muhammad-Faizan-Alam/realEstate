const express = require("express");
const router = express.Router();
const developerController = require("../controllers/developerController");
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(authMiddleware);

// CRUD routes
router.get("/", developerController.listDevelopers);
router.get("/:id", developerController.getDeveloper);
router.post("/", developerController.createDeveloper);
router.post("/bulk", developerController.bulkInsert);
router.put("/:id", developerController.updateDeveloper);
router.delete("/:id", developerController.deleteDeveloper);

module.exports = router;
