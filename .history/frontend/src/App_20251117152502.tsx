// frontend/src/App.tsx (excerpt)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoresList from "./pages/StoresList";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateStore from "./pages/AdminCreateStore";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminStores from "./pages/AdminStores";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardPage from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/stores" element={<StoresList />} />

            {/* admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-store"
              element={
                <ProtectedRoute role="admin">
                  <AdminCreateStore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-user"
              element={
                <ProtectedRoute role="admin">
                  <AdminCreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute role="admin">
                  <AdminStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
