const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const { allowRoles } = require("../middleware/roles");
const { uploadDataset, listDatasets, downloadDataset } = require("../controllers/datasetController");

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || "";
    cb(null, `${timestamp}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * /api/datasets/upload:
 *   post:
 *     summary: Upload a dataset file
 *     tags:
 *       - Datasets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Uploaded
 */
router.post("/upload", upload.single("file"), uploadDataset);

/**
 * @swagger
 * /api/datasets:
 *   get:
 *     summary: List uploaded datasets (admin sees all)
 *     tags:
 *       - Datasets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploads
 */
router.get("/", listDatasets);

/**
 * @swagger
 * /api/datasets/{id}/download:
 *   get:
 *     summary: Download a dataset file
 *     tags:
 *       - Datasets
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
 *         description: File download
 */
router.get("/:id/download", downloadDataset);

module.exports = router;
