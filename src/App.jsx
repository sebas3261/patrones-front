import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Signup";
// import NProgress from "nprogress"; // no olvides instalarlo e importarlo si lo usas

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // NProgress.start();
    const t = setTimeout(() => {
      // NProgress.done();
    }, 300);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
}
