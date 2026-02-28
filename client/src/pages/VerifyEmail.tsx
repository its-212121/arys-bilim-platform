import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://arys-bilim-platform.onrender.com";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = useMemo(() => params.get("email") || "", [params]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!email) setError("Email is missing. Go back and register again.");
  }, [email]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Verification failed");
        setLoading(false);
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setInfo("");
    setResendLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Failed to resend code");
        setResendLoading(false);
        return;
      }

      setInfo("New code sent to your email.");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-1">Enter verification code</h1>
        <p className="text-sm text-gray-500 mb-4">
          We sent a 6-digit code to <span className="font-semibold">{email || "your email"}</span>
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-700 text-sm">
            {info}
          </div>
        )}

        <form onSubmit={verify} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Code</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 tracking-widest text-center"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              required
            />
          </div>

          <button
            disabled={loading || !email}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            onClick={resend}
            disabled={resendLoading || !email}
            className="text-blue-600 hover:underline disabled:opacity-60"
            type="button"
          >
            {resendLoading ? "Sending..." : "Resend code"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:underline"
            type="button"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
