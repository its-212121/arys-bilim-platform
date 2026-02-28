import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, ErrorBanner, Input, LinkButton } from "../components/ui";
import { request } from "../lib/api";

export default function Register() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const data = await request<{ message: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password })
      });
      setMsg(data.message);
      nav("/verify-email", { replace: true, state: { email } as any });
    } catch (e: any) {
      setErr(e.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader title="Register" subtitle="OTP will be sent to your email" />
          <CardBody>
            {err ? <div className="mb-4"><ErrorBanner message={err} /></div> : null}
            {msg ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">{msg}</div> : null}
            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <div className="text-sm text-slate-600 mb-1">Full name</div>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Password</div>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 6 chars" />
              </div>
              <Button disabled={loading} className="w-full">{loading ? "Loading..." : "Create account"}</Button>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <LinkButton to="/login">Back to login</LinkButton>
              <LinkButton to="/verify-email">Verify email</LinkButton>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
