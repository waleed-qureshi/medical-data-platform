import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPatient, fetchRecords } from "../api";

export default function RecordsPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setError(null);

    const data = await fetchPatient(id);
    if (data?.message) {
      setError(data.message);
      return;
    }
    setPatient(data);

    const rec = await fetchRecords(id);
    if (rec?.message) {
      setError(rec.message);
      return;
    }
    setRecords(rec.records || []);
    setSummary(rec.summary || null);
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/patients">Back to patients</Link>
      </div>
    );
  }

  if (!patient) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 960, margin: "24px auto" }}>
      <h2>Records for {patient.name}</h2>
      <p>
        <Link to="/patients">← Back to patients</Link>
      </p>

      {summary ? (
        <section style={{ marginBottom: 24 }}>
          <h3>Summary</h3>
          <ul>
            <li>Total records: {summary.totalRecords}</li>
            <li>Avg blood pressure: {summary.avgBloodPressure?.toFixed(1) ?? "-"}</li>
            <li>Avg cholesterol: {summary.avgCholesterol?.toFixed(1) ?? "-"}</li>
            <li>Avg glucose: {summary.avgGlucose?.toFixed(1) ?? "-"}</li>
          </ul>
        </section>
      ) : null}

      <section>
        <h3>Records</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>BP</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Cholesterol</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Glucose</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: "8px 0" }}>{r.blood_pressure ?? "-"}</td>
                <td style={{ padding: "8px 0" }}>{r.cholesterol ?? "-"}</td>
                <td style={{ padding: "8px 0" }}>{r.glucose ?? "-"}</td>
                <td style={{ padding: "8px 0" }}>{r.notes ?? ""}</td>
              </tr>
            ))}
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "16px 0", textAlign: "center" }}>
                  No records yet
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
