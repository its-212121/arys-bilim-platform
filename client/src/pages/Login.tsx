import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, ErrorBanner, Input, LinkButton } from "../components/ui";
import { useAuth } from "../state/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login, loading, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    }
  }

  if (token) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Already logged in</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader title="Login" subtitle="Use your verified email + password" />
          <CardBody>
            {err ? <div className="mb-4"><ErrorBanner message={err} /></div> : null}
            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <div className="text-sm text-slate-600 mb-1">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Password</div>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button disabled={loading} className="w-full">{loading ? "Loading..." : "Login"}</Button>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <LinkButton to="/register">Create account</LinkButton>
              <LinkButton to="/verify-email">Verify email</LinkButton>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
