const pool = require("../config/db");
const path = require("path");

async function uploadDataset(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    const filePath = req.file.path;
    const [result] = await pool.query(
      "INSERT INTO datasets (file_path, uploaded_by, status, created_at) VALUES (?, ?, ?, NOW())",
      [filePath, req.user.id, "uploaded"]
    );

    res.status(201).json({ id: result.insertId, file_path: filePath, status: "uploaded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to record dataset upload" });
  }
}

async function listDatasets(req, res) {
  try {
    const query = req.user.role === "admin" ? "SELECT * FROM datasets" : "SELECT * FROM datasets WHERE uploaded_by = ?";
    const params = req.user.role === "admin" ? [] : [req.user.id];
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list datasets" });
  }
}

async function downloadDataset(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM datasets WHERE id = ?", [id]);
    const dataset = rows[0];
    if (!dataset) return res.status(404).json({ message: "Dataset not found" });

    if (req.user.role !== "admin" && dataset.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const filePath = path.resolve(dataset.file_path);
    return res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download dataset" });
  }
}

module.exports = { uploadDataset, listDatasets, downloadDataset };
