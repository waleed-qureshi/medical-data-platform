const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { allowRoles } = require("../middleware/roles");
const { getOverallSummary } = require("../controllers/analyticsController");

router.use(authMiddleware);

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get overall analytics (requires auth)
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics summary
 */
router.get("/summary", allowRoles("admin"), getOverallSummary);

module.exports = router;
