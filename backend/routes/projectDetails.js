const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectDetailController');
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(authMiddleware);

router.get('/', ctrl.listProjects);
router.get('/:id', ctrl.getProject);
router.post('/', ctrl.createProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);

module.exports = router;