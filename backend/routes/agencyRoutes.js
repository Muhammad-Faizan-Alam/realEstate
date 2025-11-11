const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agencyController");
const { authMiddleware } = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(authMiddleware);

router.get("/", agencyController.listAgencies);
router.get("/:id", agencyController.getAgency);
router.post("/", agencyController.createAgency);
router.put("/:id", agencyController.updateAgency);
router.delete("/:id", agencyController.deleteAgency);
router.get('/find/:id', agencyController.findAgency);
router.put('/verify/:id', agencyController.verifyAgency);

// New routes for agency dashboard
router.get('/:agencyId/properties', agencyController.getAgencyProperties);
router.get('/:agencyId/stats', agencyController.getAgencyStats);
router.get('/:agencyId/counts', agencyController.getPropertyCounts);

module.exports = router;