const pool = require("../config/db");

async function getOverallSummary(req, res) {
  try {
    const [records] = await pool.query("SELECT blood_pressure, cholesterol, glucose FROM records");
    const total = records.length;

    if (!total) {
      return res.json({ totalRecords: 0, avgBloodPressure: null, avgCholesterol: null, avgGlucose: null });
    }

    const sums = records.reduce(
      (acc, row) => {
        acc.blood_pressure += Number(row.blood_pressure) || 0;
        acc.cholesterol += Number(row.cholesterol) || 0;
        acc.glucose += Number(row.glucose) || 0;
        return acc;
      },
      { blood_pressure: 0, cholesterol: 0, glucose: 0 }
    );

    return res.json({
      totalRecords: total,
      avgBloodPressure: sums.blood_pressure / total,
      avgCholesterol: sums.cholesterol / total,
      avgGlucose: sums.glucose / total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve analytics" });
  }
}

module.exports = { getOverallSummary };
