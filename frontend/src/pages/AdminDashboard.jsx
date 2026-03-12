import { useEffect, useState } from "react";
import { fetchUsers, fetchAnalytics } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError(null);
    const usersRes = await fetchUsers();
    if (usersRes?.message) {
      setError(usersRes.message);
      return;
    }

    const analyticsRes = await fetchAnalytics();
    if (analyticsRes?.message) {
      setError(analyticsRes.message);
      return;
    }

    setUsers(usersRes);
    setAnalytics(analyticsRes);
  }

  const chartData = analytics
    ? [
        { metric: "Avg BP", value: analytics.avgBloodPressure },
        { metric: "Avg Cholesterol", value: analytics.avgCholesterol },
        { metric: "Avg Glucose", value: analytics.avgGlucose },
      ]
    : [];

  return (
    <div style={{ maxWidth: 960, margin: "24px auto" }}>
      <h2>Admin Dashboard</h2>
      {error ? <div style={{ color: "red" }}>{error}</div> : null}

      <section style={{ marginTop: 24 }}>
        <h3>Active Users</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>ID</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: "8px 0" }}>{u.id}</td>
                <td style={{ padding: "8px 0" }}>{u.name}</td>
                <td style={{ padding: "8px 0" }}>{u.email}</td>
                <td style={{ padding: "8px 0" }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Analytics</h3>
        {analytics ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading analytics...</p>
        )}
      </section>
    </div>
  );
}
