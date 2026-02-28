import React, { useEffect, useMemo, useState } from "react";
import { Shell, Card, CardBody, CardHeader, Button, ErrorBanner, Input, Textarea } from "../components/ui";
import { API_URL, request } from "../lib/api";
import { useAuth } from "../state/AuthContext";

type Achievement = {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  certificateUrl?: string;
};

type Portfolio = { aboutMe: string; motivationLetter: string };

export default function Achievements() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Achievement[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>({ aboutMe: "", motivationLetter: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const data = await request<{ achievements: Achievement[]; portfolio: Portfolio }>("/api/achievements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(data.achievements);
      setPortfolio(data.portfolio);
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addAchievement(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setErr("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("date", date);
      fd.append("category", category);
      if (file) fd.append("certificate", file);

      const res = await fetch(`${API_URL}/api/achievements`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to add");

      setTitle(""); setDescription(""); setDate(""); setCategory(""); setFile(null);
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to add");
    }
  }

  async function savePortfolio() {
    if (!token) return;
    setErr("");
    try {
      await request("/api/achievements/portfolio/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(portfolio)
      });
    } catch (e: any) {
      setErr(e.message || "Failed to save");
    }
  }

  async function del(id: string) {
    if (!token) return;
    setErr("");
    try {
      await request(`/api/achievements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to delete");
    }
  }

  const publicLink = useMemo(() => user ? `${window.location.origin}/portfolio/${user.id}` : "", [user]);

  return (
    <Shell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader title="Add achievement" subtitle="Upload certificate (png/jpg/webp/pdf) optional" />
            <CardBody>
              {err ? <div className="mb-4"><ErrorBanner message={err} /></div> : null}
              <form onSubmit={addAchievement} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <div className="text-sm text-slate-600 mb-1">Title</div>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-slate-600 mb-1">Description</div>
                  <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Date</div>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Category</div>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Olympiad / Project / Sport..." />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-slate-600 mb-1">Certificate file</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit">Add</Button>
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="My achievements" subtitle={loading ? "Loading..." : `${items.length} items`} />
            <CardBody>
              {items.length === 0 ? (
                <div className="text-sm text-slate-500">No achievements yet.</div>
              ) : (
                <div className="space-y-3">
                  {items.map((a) => (
                    <div key={a._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{a.title}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(a.date).toLocaleDateString()} · {a.category || "—"}
                          </div>
                        </div>
                        <Button variant="ghost" onClick={() => del(a._id)}>Delete</Button>
                      </div>
                      {a.description ? <div className="text-sm text-slate-700 mt-2">{a.description}</div> : null}
                      {a.certificateUrl ? (
                        <a
                          className="text-sm text-blue-700 hover:underline mt-2 inline-block"
                          href={`${API_URL}${a.certificateUrl}`}
                          target="_blank"
                        >
                          View certificate
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Portfolio text" subtitle="Saved in MongoDB" />
            <CardBody>
              <div className="text-sm text-slate-600 mb-1">About me</div>
              <Textarea rows={5} value={portfolio.aboutMe} onChange={(e) => setPortfolio({ ...portfolio, aboutMe: e.target.value })} />

              <div className="text-sm text-slate-600 mt-4 mb-1">Motivation letter</div>
              <Textarea rows={7} value={portfolio.motivationLetter} onChange={(e) => setPortfolio({ ...portfolio, motivationLetter: e.target.value })} />

              <div className="mt-3">
                <Button onClick={savePortfolio}>Save</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Public view" subtitle="Share this link" />
            <CardBody>
              <div className="text-sm break-all text-slate-700">{publicLink || "—"}</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
