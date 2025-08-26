import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Link } from "react-router-dom";

export default function index() {
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault(); // evitar refresh de la página
  setError("");

  try {
    // 👇 Aquí llamamos al login del AuthContext
    await login(email, password);

    // Si fue exitoso → redirige
    navigate("/home"); // o donde quieras llevar al usuario (ej: /dashboard)
  } catch (err) {
    console.error("❌ Error en login:", err);
    setError("Credenciales inválidas o error en el servidor");
  }
};


  return (
    <main className="login-container">
      <div className="login-imagen">
        <img src="/Fondo.webp" className="back-img" />
      </div>
      <div className="login-form-container">
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.webp" className="logo-img" alt="Sweet Match Logo" />
          </Link>
        </div>
        <div className="login-content">
          <h2>
            Bienvenido a <span>Sweet Match!</span>
          </h2>
          <h3 className="login-subtitle">
            No tienes cuenta? <a href="/registro">Crea una</a>
          </h3>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p href="/auth/recover">Olvidaste tu contraseña?</p>
            <div className="login-button-container">
              <button type="submit" className="login-button">
                Ingresa
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
