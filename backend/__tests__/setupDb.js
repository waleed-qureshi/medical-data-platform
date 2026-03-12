const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function resetDatabase() {
    const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");
  const rawSql = fs.readFileSync(schemaPath, "utf-8");
  const dbName = process.env.DB_NAME || "medical_data_platform";
  const sql = rawSql.replace(/medical_data_platform/g, dbName);
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length);

  for (const stmt of statements) {
    try {
      await pool.query(stmt);
    } catch (err) {
      // ignore errors for statements like CREATE DATABASE when already exists
    }
  }
}

module.exports = { resetDatabase };
