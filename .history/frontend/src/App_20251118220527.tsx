// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

import RoleRedirect from "./components/auth/RoleRedirect";

// User pages
import StoresDashboard from "./pages/StoresDashboard";
import ChangePassword from "./pages/ChangePassword";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components//ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminStores from "./pages/AdminStores";
import AdminCreateStore from "./pages/AdminCreateStore";

// Store Owner
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import StoreOwnerRatings from "./pages/StoreOwnerRatings";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="py-6">
        <Routes>
          {/* ------------------ ADMIN ROUTES ------------------ */}
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
            path="/admin/create-store"
            element={
              <ProtectedRoute role="admin">
                <AdminCreateStore />
              </ProtectedRoute>
            }
          />

          {/* ------------------ STORE OWNER ROUTES ------------------ */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="store_owner">
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/ratings"
            element={
              <ProtectedRoute role="store_owner">
                <StoreOwnerRatings />
              </ProtectedRoute>
            }
          />

          {/* ------------------ CUSTOMER ROUTES ------------------ */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute role="user">
                <StoresDashboard />
              </ProtectedRoute>
            }
          />

          {/* ------------------ SHARED ROUTES ------------------ */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* ------------------ PUBLIC ROUTES ------------------ */}
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

          {/* ------------------ ROOT + FALLBACK (MUST BE LAST) ------------------ */}

          {/* Smart landing depending on role */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Anything invalid gets redirected */}
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
