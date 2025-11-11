const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(authMiddleware);

// public
router.get('/', ctrl.listProjects);
router.get('/:id', ctrl.getProject);

// admin (no auth by default; add middleware/auth later)
router.post('/', ctrl.createProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);

module.exports = router;
