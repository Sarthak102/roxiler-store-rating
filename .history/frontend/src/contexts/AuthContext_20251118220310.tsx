/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

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

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("accessToken");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync whenever token/user changes.
  useEffect(() => {
    try {
      if (token) localStorage.setItem("accessToken", token);
      else localStorage.removeItem("accessToken");
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch {
      // ignore
    }
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
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
