// frontend/src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    try { window.history.pushState(null, "", "/login"); } catch {}
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-semibold">StoreRatings</Link>
            <Link to="/stores" className="text-sm text-gray-700 hover:underline">Stores</Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm text-gray-700 hover:underline">Admin</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-sm text-gray-600">Hello, {user.name.split(" ")[0]}</div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm px-3 py-1 rounded hover:underline">Login</Link>
                <Link to="/register" className="text-sm">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}