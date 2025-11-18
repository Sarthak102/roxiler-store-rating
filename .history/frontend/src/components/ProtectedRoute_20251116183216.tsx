// frontend/src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { JSX } from "react/jsx-dev-runtime";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
// ProtectedRoute.tsx (updated)
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}