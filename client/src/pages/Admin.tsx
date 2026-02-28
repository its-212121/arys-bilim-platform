import React, { useEffect, useState } from "react";
import { Shell, Card, CardBody, CardHeader, Button, ErrorBanner, Input } from "../components/ui";
import { request } from "../lib/api";
import { useAuth } from "../state/AuthContext";

export default function Admin() {
  const { token, user } = useAuth();
  const [err, setErr] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [graduates, setGraduates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "", role: "teacher" });
  const [grad, setGrad] = useState<any>({
    name: "", year: new Date().getFullYear(), university: "", country: "", entScore: "", satScore: "", ieltsScore: "", program: ""
  });

  async function loadAll() {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const u = await request<{ users: any[] }>("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(u.users);
      const g = await request<{ graduates: any[] }>("/api/graduates");
      setGraduates(g.graduates);
    } catch (e: any) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function createUser() {
    if (!token) return;
    setErr("");
    try {
      await request("/api/admin/create-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser)
      });
      setNewUser({ fullName: "", email: "", password: "", role: "teacher" });
      await loadAll();
    } catch (e: any) {
      setErr(e.message || "Failed to create user");
    }
  }

  async function addGraduate() {
    if (!token) return;
    setErr("");
    try {
      const payload = {
        ...grad,
        year: Number(grad.year),
        entScore: grad.entScore === "" ? null : Number(grad.entScore),
        satScore: grad.satScore === "" ? null : Number(grad.satScore),
        ieltsScore: grad.ieltsScore === "" ? null : Number(grad.ieltsScore)
      };
      await request("/api/admin/graduates", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      setGrad({ name: "", year: new Date().getFullYear(), university: "", country: "", entScore: "", satScore: "", ieltsScore: "", program: "" });
      await loadAll();
    } catch (e: any) {
      setErr(e.message || "Failed to add graduate");
    }
  }

  async function delGraduate(id: string) {
    if (!token) return;
    setErr("");
    try {
      await request(`/api/admin/graduates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadAll();
    } catch (e: any) {
      setErr(e.message || "Failed to delete");
    }
  }

  if (user?.role !== "admin") {
    return (
      <Shell>
        <Card>
          <CardHeader title="Admin" subtitle="Access denied" />
          <CardBody>
            <ErrorBanner message="Only admin can access this page." />
          </CardBody>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-4">
        {err ? <ErrorBanner message={err} /> : null}

        <Card>
          <CardHeader title="Create teacher/admin account" subtitle="Admin-only" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <div className="text-sm text-slate-600 mb-1">Full name</div>
                <Input value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Email</div>
                <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Password</div>
                <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Role</div>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="teacher">teacher</option>
                  <option value="admin">admin</option>
                  <option value="student">student</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={createUser}>Create user</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="All users" subtitle={loading ? "Loading..." : `${users.length} users`} />
          <CardBody>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-slate-100">
                      <td className="py-2 pr-4 font-medium text-slate-900">{u.fullName}</td>
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4">{u.role}</td>
                      <td className="py-2 pr-4">{u.isEmailVerified ? "yes" : "no"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Add graduate" subtitle="Admin-only" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {["name","university","country","program"].map((k) => (
                <div key={k}>
                  <div className="text-sm text-slate-600 mb-1">{k}</div>
                  <Input value={grad[k] || ""} onChange={(e) => setGrad({ ...grad, [k]: e.target.value })} />
                </div>
              ))}
              <div>
                <div className="text-sm text-slate-600 mb-1">year</div>
                <Input type="number" value={grad.year} onChange={(e) => setGrad({ ...grad, year: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">entScore</div>
                <Input type="number" value={grad.entScore} onChange={(e) => setGrad({ ...grad, entScore: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">satScore</div>
                <Input type="number" value={grad.satScore} onChange={(e) => setGrad({ ...grad, satScore: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">ieltsScore</div>
                <Input type="number" value={grad.ieltsScore} onChange={(e) => setGrad({ ...grad, ieltsScore: e.target.value })} />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={addGraduate}>Add graduate</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Graduates list" subtitle={`${graduates.length} items`} />
          <CardBody>
            <div className="space-y-2">
              {graduates.map((g) => (
                <div key={g._id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{g.name}</div>
                    <div className="text-sm text-slate-600">{g.year} · {g.university} · {g.country}</div>
                  </div>
                  <Button variant="ghost" onClick={() => delGraduate(g._id)}>Delete</Button>
                </div>
              ))}
              {graduates.length === 0 ? <div className="text-sm text-slate-500">No graduates.</div> : null}
            </div>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
