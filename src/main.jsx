import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Login } from "@/app/auth/Login.jsx";
import AuthIndex from "@/app/auth/AuthIndex.jsx";
import Register from "@/app/auth/Register.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import Dashboard from "@/app/Dashboard.jsx";
import Profile from "@/app/profile/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<AuthIndex />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
