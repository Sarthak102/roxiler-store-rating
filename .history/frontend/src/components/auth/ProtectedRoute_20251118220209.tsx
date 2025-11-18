import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "";

type Props = {
  children: React.ReactElement;
  role?: "admin" | "store_owner" | "user";
};

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "store_owner") return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
}
