import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // NUEVO: estado de carga
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Empieza carga

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );

      const { token, nombre, rol } = res.data;
      const sesionInicio = Date.now();

      const storage = recordarme ? localStorage : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("rol", rol);
      storage.setItem("nombre", nombre);
      storage.setItem("sesionInicio", sesionInicio.toString());

      // Navegar sin necesidad de recargar
      navigate("/admin", { replace: true });
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false); // Termina carga
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login del Admin</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />

          <label style={styles.label}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              disabled={loading}
            />
            Recordarme
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={{ ...styles.button, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #c3ecf5, #e8d4f7)",
  },
  card: {
    backgroundColor: "#ffffffdd",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(5px)",
  },
  title: {
    textAlign: "center",
    color: "#1565C0",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#1565C0",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default Login;

