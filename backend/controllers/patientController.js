const pool = require("../config/db");

async function getPatients(req, res) {
  try {
    const query = req.user.role === "admin" ? "SELECT * FROM patients" : "SELECT * FROM patients WHERE created_by = ?";
    const params = req.user.role === "admin" ? [] : [req.user.id];
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
}

async function getPatientById(req, res) {
  const { id } = req.params;
  try {
    const query =
      req.user.role === "admin"
        ? "SELECT * FROM patients WHERE id = ?"
        : "SELECT * FROM patients WHERE id = ? AND created_by = ?";
    const params = req.user.role === "admin" ? [id] : [id, req.user.id];
    const [rows] = await pool.query(query, params);
    if (!rows.length) return res.status(404).json({ message: "Patient not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
}

async function createPatient(req, res) {
  const { name, age, gender, diagnosis } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO patients (name, age, gender, diagnosis, created_by, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, age || null, gender || null, diagnosis || null, req.user.id]
    );
    res.status(201).json({ id: result.insertId, name, age, gender, diagnosis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create patient" });
  }
}

async function updatePatient(req, res) {
  const { id } = req.params;
  const { name, age, gender, diagnosis } = req.body;

  try {
    const query =
      req.user.role === "admin"
        ? "UPDATE patients SET name = ?, age = ?, gender = ?, diagnosis = ? WHERE id = ?"
        : "UPDATE patients SET name = ?, age = ?, gender = ?, diagnosis = ? WHERE id = ? AND created_by = ?";
    const params =
      req.user.role === "admin"
        ? [name, age || null, gender || null, diagnosis || null, id]
        : [name, age || null, gender || null, diagnosis || null, id, req.user.id];

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Patient not found" });
    res.json({ id, name, age, gender, diagnosis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update patient" });
  }
}

async function deletePatient(req, res) {
  const { id } = req.params;
  try {
    const query =
      req.user.role === "admin" ? "DELETE FROM patients WHERE id = ?" : "DELETE FROM patients WHERE id = ? AND created_by = ?";
    const params = req.user.role === "admin" ? [id] : [id, req.user.id];

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete patient" });
  }
}

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient };
