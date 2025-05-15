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
import Map from "@/app/Map/Map.jsx";
import Profile from "@/app/profile/index.jsx";
import ProfileHistory from "@/app/profile/history.jsx";
import ProfilePreference from "@/app/profile/preference.jsx";
import ProfileAddress from "@/app/profile/address.jsx";
import ProfileReview from "@/app/profile/review.jsx";
import ProfileDisponibility from "@/app/profile/disponibility.jsx";
import CreateOffer from "@/app/Offers/CreateOffer.jsx";
import OfferSuccess from "@/app/Offers/OfferSuccess.jsx";
import Search from "@/app/Search/index.jsx";
import RegisterConfirmation from "@/app/auth/RegisterConfirmation.jsx";
import Messages from "@/app/Message/index.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<AuthIndex />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-confirmation" element={<RegisterConfirmation />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/map" element={<Map />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/history" element={<ProfileHistory />} />
            <Route path="/profile/preference" element={<ProfilePreference />} />
            <Route path="/profile/address" element={<ProfileAddress />} />
            <Route path="/profile/review" element={<ProfileReview />} />
            <Route path="/profile/disponibility" element={<ProfileDisponibility />} />
            <Route path="/offers/create" element={<CreateOffer />} />
            <Route path="/offers/success" element={<OfferSuccess />} />
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
