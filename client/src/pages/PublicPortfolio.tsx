import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, ErrorBanner } from "../components/ui";
import { API_URL, request } from "../lib/api";

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    request(`/api/portfolio/${userId}`)
      .then((d) => setData(d))
      .catch((e: any) => setErr(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6">
          <div className="text-sm opacity-90">Public Portfolio</div>
          <div className="text-2xl font-semibold mt-1">{data?.user?.fullName || (loading ? "Loading..." : "—")}</div>
          <div className="text-sm opacity-90 mt-1">{data?.user?.email || ""}</div>
        </div>

        {err ? <ErrorBanner message={err} /> : null}

        <Card>
          <CardHeader title="About me" />
          <CardBody>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{data?.portfolio?.aboutMe || "—"}</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Motivation letter" />
          <CardBody>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{data?.portfolio?.motivationLetter || "—"}</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Achievements" subtitle={`${data?.achievements?.length || 0} items`} />
          <CardBody>
            <div className="space-y-3">
              {(data?.achievements || []).map((a: any) => (
                <div key={a._id} className="rounded-2xl border border-slate-200 p-4 bg-white">
                  <div className="font-semibold text-slate-900">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(a.date).toLocaleDateString()} · {a.category || "—"}
                  </div>
                  {a.description ? <div className="text-sm text-slate-700 mt-2">{a.description}</div> : null}
                  {a.certificateUrl ? (
                    <a className="text-sm text-blue-700 hover:underline mt-2 inline-block" href={`${API_URL}${a.certificateUrl}`} target="_blank">
                      View certificate
                    </a>
                  ) : null}
                </div>
              ))}
              {(data?.achievements || []).length === 0 ? <div className="text-sm text-slate-500">No achievements.</div> : null}
            </div>
          </CardBody>
        </Card>

        <div className="text-xs text-slate-400 text-center">
          Arys Bilim Innovation School Platform
        </div>
      </div>
    </div>
  );
}
