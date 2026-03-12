const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

router.use(authMiddleware);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get list of patients (admin returns all)
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get("/", getPatients);

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a patient
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createPatient);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get a patient by id
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient data
 *       404:
 *         description: Not found
 */
router.get("/:id", getPatientById);

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update a patient
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put("/:id", updatePatient);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete("/:id", deletePatient);

module.exports = router;
