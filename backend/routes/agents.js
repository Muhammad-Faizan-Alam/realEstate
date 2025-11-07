const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(authMiddleware);

// CRUD routes
router.get("/", agentController.listAgents);
router.get('/find/:id', agentController.findAgent);
router.post("/", agentController.createAgent);
router.post("/bulk", agentController.bulkInsert);
router.put("/:id", agentController.updateAgent);
router.delete("/:id", agentController.deleteAgent);
router.put('/verify/:id', agentController.verifyAgent);
router.post('/stories/:id', agentController.addStory);
router.delete('/stories/:storyId', agentController.deleteStory);
router.post('/stories/:storyId/repost', agentController.repostStory);
router.get('/stories/:id', agentController.getStories);
router.get('/stories', agentController.getAllStories);


router.get("/:id", agentController.getAgent);

module.exports = router;
