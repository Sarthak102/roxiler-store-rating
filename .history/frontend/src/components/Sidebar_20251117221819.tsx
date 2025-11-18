import { Link } from "react-router-dom";
import { Home, MapPin, Settings, Users, FilePlus, Star } from "lucide-react";
import useAuth from "../hooks/useAuth";

const AVATAR_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="panel rounded-2xl p-4 h-[calc(100vh-48px)] soft-shadow">
      {/* Profile */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border">
          <img src={AVATAR_URL} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="font-semibold text-lg text-gray-900">
            Welcome, {user?.name?.split(" ")[0]}
          </div>
          <div className="text-sm text-muted capitalize">{role}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {/* USER menu */}
        {role === "user" && (
          <>
            <Link to="/stores" className="sidebar-link">
              <MapPin className="icon" /> Stores
            </Link>

            <Link to="/settings" className="sidebar-link">
              <Settings className="icon" /> Settings
            </Link>
          </>
        )}

        {/* ADMIN menu */}
        {role === "admin" && (
          <>
            <Link to="/admin" className="sidebar-link">
              <Home className="icon" /> Dashboard
            </Link>

            <Link to="/admin/users" className="sidebar-link">
              <Users className="icon" /> Users
            </Link>

            <Link to="/admin/create-user" className="sidebar-link">
              <FilePlus className="icon" /> Create User
            </Link>

            <Link to="/admin/stores" className="sidebar-link">
              <MapPin className="icon" /> Stores
            </Link>

            <Link to="/admin/create-store" className="sidebar-link">
              <FilePlus className="icon" /> Create Store
            </Link>

            <Link to="/settings" className="sidebar-link">
              <Settings className="icon" /> Settings
            </Link>
          </>
        )}

        {/* STORE OWNER menu */}
        {role === "store_owner" && (
          <>
            <Link to="/owner" className="sidebar-link">
              <Home className="icon" /> Dashboard
            </Link>

            <Link to="/owner/ratings" className="sidebar-link">
              <Star className="icon" /> Rating Activity
            </Link>

            <Link to="/settings" className="sidebar-link">
              <Settings className="icon" /> Settings
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
