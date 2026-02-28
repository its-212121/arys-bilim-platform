import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "https://arys-bilim-platform.onrender.com").replace(/\/$/, "");

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Registration failed");
        return;
      }

      navigate(`/verify-email?email=${encodeURIComponent(data?.email || email)}`);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-4">We will send a verification code to your email</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Sending code..." : "Register"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline" type="button">
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}
