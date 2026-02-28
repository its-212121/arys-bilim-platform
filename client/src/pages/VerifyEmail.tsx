import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, ErrorBanner, Input, LinkButton } from "../components/ui";
import { request } from "../lib/api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const loc = useLocation() as any;
  const [email, setEmail] = useState(loc?.state?.email || "");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const data = await request<{ message: string }>("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code })
      });
      setMsg(data.message);
      nav("/login");
    } catch (e: any) {
      setErr(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader title="Verify Email" subtitle="Enter the 6-digit OTP code" />
          <CardBody>
            {err ? <div className="mb-4"><ErrorBanner message={err} /></div> : null}
            {msg ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">{msg}</div> : null}
            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <div className="text-sm text-slate-600 mb-1">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">OTP code</div>
                <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
              </div>
              <Button disabled={loading} className="w-full">{loading ? "Loading..." : "Verify"}</Button>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <LinkButton to="/login">Back to login</LinkButton>
              <LinkButton to="/register">Register</LinkButton>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
