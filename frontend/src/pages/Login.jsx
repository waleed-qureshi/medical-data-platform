import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveAuth } from "../api";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const response = await login(email, password);
    if (response.token) {
      saveAuth(response);
      setUser(response.user);
      navigate("/patients");
      return;
    }

    setError(response.message || "Login failed");
  }

  return (
    <div style={{ maxWidth: 480, margin: "48px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error ? <div style={{ color: "red" }}>{error}</div> : null}
      </form>
      <p style={{ marginTop: 16 }}>
        Tip: Register a new user by calling the backend <code>/api/auth/register</code> endpoint.
      </p>
    </div>
  );
}
