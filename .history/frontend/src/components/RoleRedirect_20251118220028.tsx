import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "store_owner") return <Navigate to="/owner" replace />;

  return <Navigate to="/stores" replace />;
}
