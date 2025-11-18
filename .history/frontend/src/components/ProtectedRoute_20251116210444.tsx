// frontend/src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const { user } = useAuth();

  // not logged in -> redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // role mismatch -> redirect to home (or your choice)
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
