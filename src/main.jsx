import "./nprogress-custom.css"

// Aplica el tema antes de que se monte React
const temaGuardado = localStorage.getItem("tema") || "light";
const html = document.documentElement;

html.classList.remove("light", "dark");

if (temaGuardado === "dark") {
  html.classList.add("dark");
} else if (temaGuardado === "light") {
  html.classList.add("light");
} else {
  // system
  const prefiereOscuro = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  html.classList.add(prefiereOscuro ? "dark" : "light");
}

import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
