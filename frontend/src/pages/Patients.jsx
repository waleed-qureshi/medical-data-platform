import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPatients, createPatient } from "../api";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", gender: "", diagnosis: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    const data = await fetchPatients();
    if (data?.message) {
      setError(data.message);
      return;
    }
    setPatients(data);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);

    const created = await createPatient({
      name: form.name,
      age: Number(form.age) || null,
      gender: form.gender,
      diagnosis: form.diagnosis,
    });

    if (created?.message) {
      setError(created.message);
      return;
    }

    setForm({ name: "", age: "", gender: "", diagnosis: "" });
    loadPatients();
  }

  return (
    <div style={{ maxWidth: 960, margin: "24px auto" }}>
      <h2>Patients</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Create patient</h3>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Name"
            required
          />
          <input
            value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            placeholder="Age"
            type="number"
          />
          <input
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            placeholder="Gender"
          />
          <input
            value={form.diagnosis}
            onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
            placeholder="Diagnosis"
          />
          <button type="submit">Create patient</button>
        </form>
        {error ? <div style={{ color: "red" }}>{error}</div> : null}
      </section>

      <section>
        <h3>Existing patients</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Age</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Diagnosis</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: "8px 0" }}>{p.name}</td>
                <td style={{ padding: "8px 0" }}>{p.age ?? "-"}</td>
                <td style={{ padding: "8px 0" }}>{p.diagnosis ?? "-"}</td>
                <td style={{ padding: "8px 0" }}>
                  <Link to={`/patients/${p.id}`}>View records</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
