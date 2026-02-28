import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Diary from "./pages/Diary";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Graduates from "./pages/Graduates";
import GraduateDetails from "./pages/GraduateDetails";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PublicPortfolio from "./pages/PublicPortfolio";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/portfolio/:userId" element={<PublicPortfolio />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diary"
        element={
          <ProtectedRoute>
            <Diary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/graduates"
        element={
          <ProtectedRoute>
            <Graduates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/graduates/:id"
        element={
          <ProtectedRoute>
            <GraduateDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
