import React from "react";
import { Shell, Card, CardBody, CardHeader } from "../components/ui";

const demo = [
  { subject: "Math", q1: 9, q2: 10, q3: 8, final: 9 },
  { subject: "Physics", q1: 10, q2: 9, q3: 9, final: 9 },
  { subject: "English", q1: 8, q2: 9, q3: 10, final: 9 }
];

export default function Diary() {
  return (
    <Shell>
      <Card>
        <CardHeader title="Diary" subtitle="Grades table demo (UI only)" />
        <CardBody>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Q1</th>
                  <th className="py-2 pr-4">Q2</th>
                  <th className="py-2 pr-4">Q3</th>
                  <th className="py-2 pr-4">Final</th>
                </tr>
              </thead>
              <tbody>
                {demo.map((r) => (
                  <tr key={r.subject} className="border-t border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-900">{r.subject}</td>
                    <td className="py-2 pr-4">{r.q1}</td>
                    <td className="py-2 pr-4">{r.q2}</td>
                    <td className="py-2 pr-4">{r.q3}</td>
                    <td className="py-2 pr-4">{r.final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Shell>
  );
}
