// frontend/src/App.tsx (update)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StoresList from "./pages/StoresList";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateUser from "./pages/AdminCreateUser";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <StoresList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
// frontend/src/App.tsx (excerpt)
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminCreateStore from "./pages/AdminCreateStore";
// ... other imports

<Route
  path="/admin/create-user"
  element={
    <ProtectedRoute role="admin">
      <AdminCreateUser />
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