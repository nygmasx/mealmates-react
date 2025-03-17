import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import ConnectionForm from "/components/connection-form.jsx";
import RegisterForm from "/components/register-form.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<AuthLayout />}>
        <Route path="login" element={<ConnectionForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
