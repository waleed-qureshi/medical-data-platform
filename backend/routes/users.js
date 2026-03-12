const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { allowRoles } = require("../middleware/roles");
const { listUsers } = require("../controllers/userController");

router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", allowRoles("admin"), listUsers);

module.exports = router;
