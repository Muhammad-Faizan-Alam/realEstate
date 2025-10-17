const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const router = express.Router();

router.get("/", getAllUsers);
router.delete('/', deleteUser);

module.exports = router;