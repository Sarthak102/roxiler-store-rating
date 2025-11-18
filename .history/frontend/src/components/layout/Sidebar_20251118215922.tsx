
import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  MapPin,
  Settings,
  Users,
  FilePlus,
  Star,
  List,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const AVATAR_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

function SidebarLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50"
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  const firstName = user?.name?.split(" ")[0] ?? "Guest";

  const isAdmin = role === "admin";
  const isOwner = role === "store_owner";
  const isCustomer = role === "user";

  return (
    <div className="panel rounded-2xl p-4 h-[calc(90vh-48px)] soft-shadow">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={AVATAR_URL}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="font-semibold text-lg text-gray-900">
            Welcome, {firstName}
          </div>
          <div className="text-sm text-muted capitalize">
            {isAdmin ? "Administrator" : isOwner ? "Store Owner" : "Customer"}
          </div>
        </div>
      </div>

      
      <div className="mt-4 space-y-2">
        {/* Home (all users) */}
        <SidebarLink to="/">
          <Home className="w-5 h-5 text-gray-700" />
          <span className="text-sm">Home</span>
        </SidebarLink>

        {/* Stores — ONLY for Customers (NOT store owners, NOT admins) */}
        {isCustomer && (
          <SidebarLink to="/stores">
            <MapPin className="w-5 h-5 text-gray-700" />
            <span className="text-sm">Stores</span>
          </SidebarLink>
        )}

        {/* STORE OWNER MENU */}
        {isOwner && (
          <>
            <SidebarLink to="/owner">
              <Star className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Dashboard</span>
            </SidebarLink>

            <SidebarLink to="/owner/ratings">
              <List className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Ratings</span>
            </SidebarLink>

            {/* ❌ Profile removed */}
            {/* ❌ Stores removed */}
          </>
        )}

        {/* ADMIN MENU */}
        {isAdmin && (
          <>
            <SidebarLink to="/admin">
              <Users className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Dashboard</span>
            </SidebarLink>

            <SidebarLink to="/admin/users">
              <FilePlus className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Users</span>
            </SidebarLink>

            <SidebarLink to="/admin/stores">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Stores (admin)</span>
            </SidebarLink>
          </>
        )}

        {/* SETTINGS — everyone keeps */}
        <SidebarLink to="/settings">
          <Settings className="w-5 h-5 text-gray-700" />
          <span className="text-sm">Settings</span>
        </SidebarLink>
      </div>
    </div>
  );
}
