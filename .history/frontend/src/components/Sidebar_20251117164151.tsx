// frontend/src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Settings } from "lucide-react";
import useAuth from "../hooks/useAuth";

const AVATAR_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="panel rounded-2xl p-4 h-[calc(100vh-48px)] soft-shadow">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={AVATAR_URL}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="font-semibold text-lg text-gray-900">Welcome</div>
          <div className="text-sm text-muted">Customer</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50"
        >
          <Home className="w-5 h-5 text-gray-700" />{" "}
          <span className="text-sm">Home</span>
        </Link>

        <Link
          to="/stores"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50"
        >
          <MapPin className="w-5 h-5 text-gray-700" />{" "}
          <span className="text-sm">Stores</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50"
        >
          <Settings className="w-5 h-5 text-gray-700" />{" "}
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </div>
  );
}
