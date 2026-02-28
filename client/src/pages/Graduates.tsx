import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shell, Card, CardBody, CardHeader, ErrorBanner } from "../components/ui";
import { request } from "../lib/api";

type Graduate = {
  _id: string;
  name: string;
  year: number;
  university: string;
  country: string;
};

export default function Graduates() {
  const [items, setItems] = useState<Graduate[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    request<{ graduates: Graduate[] }>("/api/graduates")
      .then((d) => setItems(d.graduates))
      .catch((e: any) => setErr(e.message || "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Shell>
      <Card>
        <CardHeader title="Graduates" subtitle={loading ? "Loading..." : "Click a card to view details"} />
        <CardBody>
          {err ? <div className="mb-4"><ErrorBanner message={err} /></div> : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((g) => (
              <Link key={g._id} to={`/graduates/${g._id}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition">
                <div className="font-semibold text-slate-900">{g.name}</div>
                <div className="text-sm text-slate-600 mt-1">{g.year} · {g.country}</div>
                <div className="text-sm text-slate-700 mt-2">{g.university}</div>
              </Link>
            ))}
          </div>
          {items.length === 0 && !loading ? <div className="text-sm text-slate-500">No graduates yet.</div> : null}
        </CardBody>
      </Card>
    </Shell>
  );
}
