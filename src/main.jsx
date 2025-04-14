import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Login } from "@/app/auth/Login.jsx";
import AuthIndex from "@/app/auth/AuthIndex.jsx";
import Register from "@/app/auth/Register.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import Dashboard from "@/app/Dashboard.jsx";
import Profile from "@/app/profile/index.jsx";
import ProfileHistory from "@/app/profile/history.jsx";
import ProfilePreference from "@/app/profile/preference.jsx";
import ProfileAddress from "@/app/profile/address.jsx";
import ProfileReview from "@/app/profile/review.jsx";
import ProfileDisponibility from "@/app/profile/disponibility.jsx";

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
            <Route path="/profile/history" element={<ProfileHistory />} />
            <Route path="/profile/preference" element={<ProfilePreference />} />
            <Route path="/profile/address" element={<ProfileAddress />} />
            <Route path="/profile/review" element={<ProfileReview />} />
            <Route path="/profile/disponibility" element={<ProfileDisponibility />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
