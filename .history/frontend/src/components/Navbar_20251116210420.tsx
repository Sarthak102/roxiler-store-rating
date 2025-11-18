// frontend/src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout clears localStorage and context
    logout();

    // replace history so 'Back' won't show protected pages
    // 1) navigate to login and replace current entry
    navigate("/login", { replace: true });

    // 2) push a fresh state so forward/back entries don't reveal old content
    try {
      window.history.pushState(null, "", "/login");
    } catch (e) {
      // ignore on browsers that restrict pushState
    }

    // 3) optional hard reload (uncomment only if you observe stale UI)
    // window.location.replace("/login");
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-semibold">
              StoreRatings
            </Link>
            <Link
              to="/stores"
              className="text-sm text-gray-700 hover:underline"
            >
              Stores
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm text-gray-700 hover:underline"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-sm text-gray-600">
                  Hello, {user.name.split(" ")[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm px-3 py-1 rounded hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
