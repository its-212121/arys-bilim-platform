import React from "react";
import { Shell, Card, CardBody, CardHeader } from "../components/ui";
import { useAuth } from "../state/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <Shell>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="My profile" />
          <CardBody>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Full name:</span> <span className="font-medium">{user?.fullName}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium">{user?.email}</span></div>
              <div><span className="text-slate-500">Role:</span> <span className="font-medium">{user?.role}</span></div>
              <div className="text-slate-500 mt-4">Tip: share your public portfolio link with universities or competitions.</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Public portfolio link" subtitle="No login required for viewers" />
          <CardBody>
            <div className="text-sm text-slate-700">
              Route: <span className="font-mono">/portfolio/{user?.id}</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Example: http://localhost:5173/portfolio/{user?.id}
            </div>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
