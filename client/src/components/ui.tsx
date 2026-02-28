import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const { variant = "primary", className = "", ...rest } = props;
  const base = "px-4 py-2 rounded-xl text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-transparent hover:bg-blue-50 text-blue-700";
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">{children}</div>;
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-5 py-4 border-b border-slate-100">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="text-sm text-slate-500 mt-1">{subtitle}</div> : null}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-5">{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 ${props.className || ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 ${props.className || ""}`}
    />
  );
}

export function Topbar() {
  const { user, logout } = useAuth();
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
      <div className="font-semibold text-slate-900">Arys Bilim Platform</div>
      <div className="flex items-center gap-3">
        {user ? <div className="text-sm text-slate-600">{user.fullName} · {user.role}</div> : null}
        {user ? <Button variant="ghost" onClick={logout}>Logout</Button> : null}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const linkCls = ({ isActive }: any) =>
    `block px-3 py-2 rounded-xl text-sm ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`;

  return (
    <div className="w-64 border-r border-slate-200 bg-white p-3">
      <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white">
        <div className="font-semibold">Dashboard</div>
        <div className="text-xs opacity-90">School Management System</div>
      </div>

      <div className="mt-4 space-y-1">
        <NavLink to="/dashboard" className={linkCls}>Home</NavLink>
        <NavLink to="/diary" className={linkCls}>Diary</NavLink>
        <NavLink to="/profile" className={linkCls}>Profile</NavLink>
        <NavLink to="/achievements" className={linkCls}>Achievements</NavLink>
        <NavLink to="/graduates" className={linkCls}>Graduates</NavLink>
        <NavLink to="/about" className={linkCls}>About</NavLink>
        <NavLink to="/contact" className={linkCls}>Contact</NavLink>
        {user?.role === "admin" ? <NavLink to="/admin" className={linkCls}>Admin</NavLink> : null}
      </div>

      <div className="mt-6 px-3 text-xs text-slate-400">
        Public portfolio route: <span className="font-mono">/portfolio/:userId</span>
      </div>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
      {message}
    </div>
  );
}

export function LinkButton({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-blue-700 hover:underline text-sm">
      {children}
    </Link>
  );
}
