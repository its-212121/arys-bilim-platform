import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Shell, Card, CardBody, CardHeader, ErrorBanner } from "../components/ui";
import { request } from "../lib/api";

export default function GraduateDetails() {
  const { id } = useParams();
  const [g, setG] = useState<any>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    request<{ graduate: any }>(`/api/graduates/${id}`)
      .then((d) => setG(d.graduate))
      .catch((e: any) => setErr(e.message || "Failed"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Shell>
      <Card>
        <CardHeader title={g?.name || (loading ? "Loading..." : "Graduate")} subtitle={g ? `${g.year} · ${g.university}` : ""} />
        <CardBody>
          {err ? <ErrorBanner message={err} /> : null}
          {g ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500">Country</div>
                <div className="font-medium text-slate-900">{g.country}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500">Program</div>
                <div className="font-medium text-slate-900">{g.program || "—"}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500">ENT/UNT</div>
                <div className="font-medium text-slate-900">{g.entScore ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500">SAT</div>
                <div className="font-medium text-slate-900">{g.satScore ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-slate-500">IELTS</div>
                <div className="font-medium text-slate-900">{g.ieltsScore ?? "—"}</div>
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </Shell>
  );
}
