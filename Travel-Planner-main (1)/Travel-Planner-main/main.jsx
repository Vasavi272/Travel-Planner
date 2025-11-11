import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./SplashPage.jsx";
import HomePage from "./HomePage.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx"; // ✅ exists now
import "./style.css";
import AboutPage from "./AboutPage.jsx";
import ContactPage from "./ContactPage.jsx";
import HotelsPage from "./HotelsPage.jsx";
import FlightsPage from "./FlightsPage.jsx";
import ToursPage from "./ToursPage.jsx";
import ExplorePage from "./ExplorePage.jsx";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
         <Route path="/flights" element={<FlightsPage />} />
         <Route path="/tours" element={<ToursPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/signup" element={<SignupPage />} />   {/* ✅ moved above wildcard */}
        
        {/* ✅ wildcard should ALWAYS be last */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
