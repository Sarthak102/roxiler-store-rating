import React from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Calendar, Award, Settings } from "lucide-react";

const NavItem = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-3 rounded-lg text-sm text-gray-700 hover:bg-white panel soft-shadow"
  >
    {children}
  </Link>
);

export default function Sidebar() {
  return (
    <div className="sticky top-6 space-y-6">
      <div className="panel p-4 rounded-2xl soft-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            E
          </div>
          <div>
            <div className="font-semibold">StoreRatings</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <NavItem to="/">
          <Home className="w-5 h-5" /> Home
        </NavItem>
        <NavItem to="/stores">
          <BookOpen className="w-5 h-5" /> Stores
        </NavItem>
        <NavItem to="/schedule">
          <Calendar className="w-5 h-5" /> Schedule
        </NavItem>
        <NavItem to="/results">
          <Award className="w-5 h-5" /> Reports
        </NavItem>
        <NavItem to="/settings">
          <Settings className="w-5 h-5" /> Settings
        </NavItem>
      </div>

      <div className="mt-6">
        <div className="text-xs text-gray-400 px-2">Settings</div>
        <div className="mt-2">
          <Link
            to="/settings"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white panel"
          >
            <Settings className="w-4 h-4" /> Preferences
          </Link>
        </div>
      </div>
    </div>
  );
}
