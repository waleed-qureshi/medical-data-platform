const pool = require("../config/db");
const { processMedicalData } = require("../services/medicalDataService");

async function createRecord(req, res) {
  const { patient_id, blood_pressure, cholesterol, glucose, notes } = req.body;
  if (!patient_id) return res.status(400).json({ message: "patient_id is required" });

  try {
    const patientQuery =
      req.user.role === "admin"
        ? "SELECT id FROM patients WHERE id = ?"
        : "SELECT id FROM patients WHERE id = ? AND created_by = ?";
    const patientParams = req.user.role === "admin" ? [patient_id] : [patient_id, req.user.id];

    const [patientRows] = await pool.query(patientQuery, patientParams);
    if (!patientRows.length) return res.status(404).json({ message: "Patient not found" });

    const [result] = await pool.query(
      "INSERT INTO records (patient_id, blood_pressure, cholesterol, glucose, notes, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [patient_id, blood_pressure || null, cholesterol || null, glucose || null, notes || null]
    );

    // Return basic processed overview for the patient
    const [records] = await pool.query("SELECT * FROM records WHERE patient_id = ?", [patient_id]);
    const summary = processMedicalData(records);

    res.status(201).json({ id: result.insertId, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create record" });
  }
}

async function getRecordsForPatient(req, res) {
  const { patientId } = req.params;

  try {
    const patientQuery =
      req.user.role === "admin"
        ? "SELECT id FROM patients WHERE id = ?"
        : "SELECT id FROM patients WHERE id = ? AND created_by = ?";
    const patientParams = req.user.role === "admin" ? [patientId] : [patientId, req.user.id];

    const [patientRows] = await pool.query(patientQuery, patientParams);
    if (!patientRows.length) return res.status(404).json({ message: "Patient not found" });

    const [records] = await pool.query("SELECT * FROM records WHERE patient_id = ?", [patientId]);
    const summary = processMedicalData(records);

    res.json({ records, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch records" });
  }
}

module.exports = { createRecord, getRecordsForPatient };
