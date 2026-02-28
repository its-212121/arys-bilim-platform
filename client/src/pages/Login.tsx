import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "https://arys-bilim-platform.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bg = useMemo(() => {
    const dots = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.7 + Math.random() * 1.2,
      d: 1 + Math.random() * 2,
    }));
    return dots;
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      navigate("/dashboard");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        {bg.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/10 blur-[1px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${10 * p.s}px`,
              height: `${10 * p.s}px`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 3.5 * p.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="mb-5"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Arys Bilim Platform
              </div>
              <div className="text-2xl font-bold mt-1">Sign in</div>
              <div className="text-sm text-white/60 mt-1">
                Enter your email and password to continue
              </div>
            </motion.div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-white/70">Email</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-blue-400/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Password</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-blue-400/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition py-2 font-semibold disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </motion.button>
            </form>

            <div className="mt-4 text-xs text-white/50">
              Accounts are created by the administrator.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
