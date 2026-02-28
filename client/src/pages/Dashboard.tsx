import React, { useEffect } from "react";
import { Shell, Card, CardBody, CardHeader, Button } from "../components/ui";
import { useAuth } from "../state/AuthContext";

export default function Dashboard() {
  const { user, refreshMe } = useAuth();

  useEffect(() => {
    refreshMe().catch(() => {});
  }, []);

  return (
    <Shell>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Welcome" subtitle="Role-based dashboard" />
          <CardBody>
            <div className="text-sm text-slate-600">Hello,</div>
            <div className="text-xl font-semibold text-slate-900">{user?.fullName || "-"}</div>
            <div className="mt-2 text-sm text-slate-600">Role: <span className="font-medium">{user?.role}</span></div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quick actions" />
          <CardBody>
            <div className="space-y-2">
              <a className="block" href="/achievements"><Button className="w-full">My achievements</Button></a>
              <a className="block" href="/graduates"><Button variant="ghost" className="w-full">View graduates</Button></a>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Admin note" subtitle="Visible for everyone (demo)" />
          <CardBody>
            <div className="text-sm text-slate-600">
              Admin features (create users, manage graduates) are available only if your role is <span className="font-mono">admin</span>.
            </div>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
