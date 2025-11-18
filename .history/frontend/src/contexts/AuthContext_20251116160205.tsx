// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../services/api";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    address?: string;
  }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAccessToken(token);
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: tkn, user: u } = res.data;
      setToken(tkn);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    address?: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", payload);
      const { token: tkn, user: u } = res.data;
      setToken(tkn);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setAccessToken(null);
  };

  const value = { user, token, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
