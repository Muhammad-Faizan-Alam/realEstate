const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(authMiddleware);

router.get("/", getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;