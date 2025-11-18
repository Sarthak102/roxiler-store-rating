
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * PublicRoute prevents authenticated users from visiting public auth pages.
 * Example: wrap /login and /register with <PublicRoute><Login/></PublicRoute>
 */
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
