// frontend/src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "./ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    try {
      window.history.pushState(null, "", "/login");
    } catch {}
  };

  return (
    <div className="w-full panel soft-shadow">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold">
            StoreRatings
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted">
            Hello, {user?.name?.split(" ")[0] ?? "Guest"}
          </div>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
