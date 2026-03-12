function processMedicalData(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      totalRecords: 0,
      avgBloodPressure: null,
      avgCholesterol: null,
      avgGlucose: null,
    };
  }

  const totals = records.reduce(
    (acc, row) => {
      acc.blood_pressure += Number(row.blood_pressure) || 0;
      acc.cholesterol += Number(row.cholesterol) || 0;
      acc.glucose += Number(row.glucose) || 0;
      return acc;
    },
    { blood_pressure: 0, cholesterol: 0, glucose: 0 }
  );

  const avg = (value) => (records.length ? value / records.length : null);

  return {
    totalRecords: records.length,
    avgBloodPressure: avg(totals.blood_pressure),
    avgCholesterol: avg(totals.cholesterol),
    avgGlucose: avg(totals.glucose),
  };
}

module.exports = { processMedicalData };
