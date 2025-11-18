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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute></PublicRoute><Login />} />
            <Route path="/register" element={<Register />} />
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
