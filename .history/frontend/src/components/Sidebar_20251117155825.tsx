// frontend/src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="sticky top-6 space-y-6">
      <div className="panel p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-700)] text-white flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <div className="font-semibold text-[var(--brand-100)]">Welcome</div>
            <div className="text-xs text-[var(--muted)]">Customer</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg text-sm text-[var(--brand-100)] hover:bg-white/5"
        >
          <Home className="w-5 h-5" /> Home
        </Link>

        <Link
          to="/stores"
          className="flex items-center gap-3 p-3 rounded-lg text-sm text-[var(--brand-100)] hover:bg-white/5"
        >
          <MapPin className="w-5 h-5" /> Stores
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg text-sm text-[var(--brand-100)] hover:bg-white/5"
        >
          <Settings className="w-5 h-5" /> Settings
        </Link>
      </div>
    </div>
  );
}
