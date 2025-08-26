import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup, token } = useAuth();
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // normaliza entradas
    const cleanNombre = nombre.trim();
    const cleanApellido = apellido.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanConfirmPassword = confirmPassword;

    // validaciones
    if (
      !cleanNombre ||
      !cleanApellido ||
      !cleanEmail ||
      !cleanPassword ||
      !cleanConfirmPassword
    ) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("El correo electrónico no es válido.");
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(cleanPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    try {
      // 👇 Usamos el email como username para el backend
      await signup(cleanEmail, cleanPassword);

      // si todo ok, redirige
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Error al registrarse. Intenta con otro correo o más tarde.");
    }
  };

  useEffect(() => {
    document.title = "Crear cuenta | Sweet Match";
  }, []);

  return (
    <main className="signup-main">
      {/* Formulario */}
      <div className="signup-form-container">
        <div>
          <Link to="/">
            <img src="/logo.webp" alt="Logo Sweet Match" className="logo-img" />
          </Link>
        </div>
        <div className="signup-content">
          <h2>Registra tu cuenta</h2>
          <h3>
            Se parte de <span>Sweet Match</span>
          </h3>

          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p>
              ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
            </p>
            <div className="signup-button-container">
              <button type="submit">Registrate</button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>

      {/* Imagen que se recorta si se pasa */}
      <div className="signup-image-container">
        <img src="/caja-brownies.webp" alt="Brownies" className="img-signup" />
      </div>
    </main>
  );
}
