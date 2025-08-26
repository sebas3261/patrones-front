import { createContext, useState, useEffect, useContext } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../nprogress-custom.css"; // tu CSS que cambia color/sombra

export const AuthContext = createContext(null);

const API =  "/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada
  useEffect(() => {
    NProgress.start();
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser  = localStorage.getItem("user");
      if (savedToken) setToken(savedToken);
      if (savedUser)  setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("Error leyendo sesión local:", e);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
      NProgress.done();
    }
  }, []);

  // Guarda sesión en memoria y localStorage
  const placeSession = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userValue));
  };

  // LOGIN (username/password)
  const login = async (username, password) => {
    NProgress.start();
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Error al iniciar sesión");
      }

      const data = await res.json();
      const tokenValue = data.token;
      // Si tu backend devuelve user, úsalo. Si no, arma uno mínimo con username:
      const userValue  = data.user ?? { id: data.id, username: data.username ?? username };

      placeSession(tokenValue, userValue);
      return { user: userValue, token: tokenValue };
    } finally {
      NProgress.done();
    }
  };

  // SIGNUP (username/password) — devuelve token para login automático
  const signup = async (username, password) => {
    NProgress.start();
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Error al registrarse");
      }

      const data = await res.json(); // esperamos { user: {id, username}, token }
      const tokenValue = data.token;
      const userValue  = data.user ?? { id: data.id, username: data.username ?? username };

      placeSession(tokenValue, userValue);
      return { user: userValue, token: tokenValue };
    } finally {
      NProgress.done();
    }
  };

  const logout = () => {
    NProgress.start();
    try {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      NProgress.done();
    }
  };

  // Helpers opcionales para endpoints protegidos
  const authFetch = (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
