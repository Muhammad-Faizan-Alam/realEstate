const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

// CRUD routes
router.get("/", agentController.listAgents);
router.get("/:id", agentController.getAgent);
router.get('/find/:id', agentController.findAgent);
router.post("/", agentController.createAgent);
router.post("/bulk", agentController.bulkInsert);
router.put("/:id", agentController.updateAgent);
router.delete("/:id", agentController.deleteAgent);
router.put('/verify/:id', agentController.verifyAgent);

module.exports = router;
