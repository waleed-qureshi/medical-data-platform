const pool = require("../config/db");

async function listUsers(req, res) {
  try {
    const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list users" });
  }
}

module.exports = { listUsers };
