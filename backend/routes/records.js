const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const { createRecord, getRecordsForPatient } = require("../controllers/recordController");

router.use(authMiddleware);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a medical record for a patient
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               blood_pressure:
 *                 type: number
 *               cholesterol:
 *                 type: number
 *               glucose:
 *                 type: number
 *               notes:
 *                 type: string
 *             required:
 *               - patient_id
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createRecord);

/**
 * @swagger
 * /api/records/{patientId}:
 *   get:
 *     summary: Get records for a patient
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Records list
 *       404:
 *         description: Not found
 */
router.get("/:patientId", getRecordsForPatient);

module.exports = router;
