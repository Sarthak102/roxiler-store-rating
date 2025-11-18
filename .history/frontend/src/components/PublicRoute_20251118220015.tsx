
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  // If user is logged in, send them to admin or stores depending on role.
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/stores" replace />;
  }

  return <>{children}</>;
}
