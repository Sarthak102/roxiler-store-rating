// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import StoresDashboard from "./pages/StoresDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminStores from "./pages/AdminStores";
import AdminCreateStore from "./pages/AdminCreateStore";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCreateUser from "./pages/AdminCreateUser";

export default function App() {
  return (
    <BrowserRouter>
      {/* Render Navbar exactly once here */}
      <Navbar />

      <div className="py-6">
        <Routes>
          <Route path="/" element={<StoresDashboard />} />
          <Route path="/stores" element={<StoresDashboard />} />

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

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ChangePassword />
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
            path="/admin/create-store"
            element={
              <ProtectedRoute role="admin">
                <AdminCreateStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<StoresDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import AdminCreateUser from "./pages/AdminCreateUser";
// ...
<Route path="/admin/create-user" element={<ProtectedRoute role="admin"><AdminCreateUser /></ProtectedRoute>} />