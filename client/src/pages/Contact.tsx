import React from "react";
import { Shell, Card, CardBody, CardHeader } from "../components/ui";

export default function Contact() {
  return (
    <Shell>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Contact" subtitle="School contacts" />
          <CardBody>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Phone:</span> +7 (700) 000-00-00</div>
              <div><span className="text-slate-500">Email:</span> info@arys-bilim.kz</div>
              <div><span className="text-slate-500">Address:</span> Shymkent, Kazakhstan</div>
              <div><span className="text-slate-500">Working hours:</span> Mon–Fri 09:00–18:00</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Social" subtitle="Links (replace with real)" />
          <CardBody>
            <div className="text-sm text-slate-700 space-y-2">
              <a className="block text-blue-700 hover:underline" href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
              <a className="block text-blue-700 hover:underline" href="#" onClick={(e) => e.preventDefault()}>Telegram</a>
              <a className="block text-blue-700 hover:underline" href="#" onClick={(e) => e.preventDefault()}>YouTube</a>
            </div>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
