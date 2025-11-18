import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoresList from "./pages/StoresList";
import AdminCreateStore from "./pages/AdminCreateStore";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminStores from "./pages/AdminStores";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import StoresDashboard from "./pages/StoresDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-6">
          <Routes>
            <Route path="/stores" element={<StoresDashboard />} />
            <Route path="/" element={<StoresDashboard />} />

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
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <DashboardPage />
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
              path="/admin/create-user"
              element={
                <ProtectedRoute role="admin">
                  <AdminCreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }<Cha
            />

            <Route path="*" element={<StoresList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
