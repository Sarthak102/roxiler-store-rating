// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import RoleRedirect from "./components/RoleRedirect"; // ← NEW

// User pages
import StoresDashboard from "./pages/StoresDashboard";
import ChangePassword from "./pages/ChangePassword";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminStores from "./pages/AdminStores";
import AdminCreateStore from "./pages/AdminCreateStore";

// Store Owner pages
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import StoreOwnerRatings from "./pages/StoreOwnerRatings";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="py-6">
        <Routes>
          {/* ADMIN routes */}
<Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
<Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
<Route path="/admin/create-user" element={<ProtectedRoute role="admin"><AdminCreateUser /></ProtectedRoute>} />
<Route path="/admin/stores" element={<ProtectedRoute role="admin"><AdminStores /></ProtectedRoute>} />
<Route path="/admin/create-store" element={<ProtectedRoute role="admin"><AdminCreateStore /></ProtectedRoute>} />

{/* STORE OWNER routes */}
<Route path="/owner" element={<ProtectedRoute role="store_owner"><StoreOwnerDashboard /></ProtectedRoute>} />
<Route path="/owner/ratings" element={<ProtectedRoute role="store_owner"><StoreOwnerRatings /></ProtectedRoute>} />

{/* CUSTOMER routes */}
<Route path="/stores" element={<ProtectedRoute role="user"><StoresDashboard /></ProtectedRoute>} />

{/* PUBLIC */}
<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

{/* SHARED */}
<Route path="/settings" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

{/* ROOT REDIRECT — KEEP THIS AT THE END */}
<Route path="/" element={<RoleRedirect />} />

{/* wildcard */}
<Route path="*" element={<RoleRedirect />} />
      </div>
    </BrowserRouter>
  );
}
