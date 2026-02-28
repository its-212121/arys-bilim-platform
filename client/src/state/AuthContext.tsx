import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../lib/api";

export type Role = "student" | "teacher" | "admin";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

const LS_TOKEN = "ab_token";
const LS_USER = "ab_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) localStorage.setItem(LS_TOKEN, token);
    else localStorage.removeItem(LS_TOKEN);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const data = await request<{ token: string; user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function refreshMe() {
    if (!token) return;
    const data = await request<{ user: any }>("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const u = data.user;
    setUser({ id: u._id || u.id, fullName: u.fullName, email: u.email, role: u.role });
  }

  const value = useMemo<AuthState>(() => ({ token, user, loading, login, logout, refreshMe }), [token, user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
