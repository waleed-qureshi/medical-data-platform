import { useEffect, useState } from "react";
import { uploadDataset, fetchUploads, downloadUpload } from "../api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUploads();
  }, []);

  async function loadUploads() {
    const data = await fetchUploads();
    if (data?.message) {
      setError(data.message);
      return;
    }
    setUploads(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Choose a file to upload");
      return;
    }

    const res = await uploadDataset(file);
    if (res?.message) {
      setError(res.message);
      return;
    }

    setFile(null);
    loadUploads();
  }

  return (
    <div style={{ maxWidth: 960, margin: "24px auto" }}>
      <h2>Dataset Upload</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit">Upload</button>
      </form>

      {error ? <div style={{ color: "red", marginTop: 12 }}>{error}</div> : null}

      <section style={{ marginTop: 32 }}>
        <h3>Uploads</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>ID</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Status</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Uploaded At</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: "8px 0" }}>{u.id}</td>
                <td style={{ padding: "8px 0" }}>{u.status}</td>
                <td style={{ padding: "8px 0" }}>{new Date(u.created_at).toLocaleString()}</td>
                <td style={{ padding: "8px 0" }}>
                  <a href={downloadUpload(u.id)} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </td>
              </tr>
            ))}
            {uploads.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "16px 0", textAlign: "center" }}>
                  No uploads yet
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
