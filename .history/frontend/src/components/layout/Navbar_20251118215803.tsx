// frontend/src/components/Navbar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const firstName = user?.name?.split(" ")[0] ?? "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand - not clickable */}
        <span className="text-xl font-semibold text-gray-900 cursor-default select-none">
          StoreRatings
        </span>

        {/* Right side: hide completely on login/register pages */}
        {!isAuthPage && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Hello, {firstName}
                </span>
                <Button
                  variant="destructive"
                  className="px-4 py-1 text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-700 hover:underline"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
