import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/stores" replace />;
  }

  return <>{children}</>;
}
