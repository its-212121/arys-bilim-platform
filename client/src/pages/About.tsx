import React from "react";
import { Shell, Card, CardBody, CardHeader, Button } from "../components/ui";

const APPLY_URL = "https://docs.google.com/forms/d/e/REPLACE_ME/viewform";

export default function About() {
  return (
    <Shell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="About Arys Bilim" subtitle="Mission & vision" />
            <CardBody>
              <div className="text-sm text-slate-700 leading-relaxed">
                Arys Bilim Innovation School Platform is a modern school management system designed for students, teachers, and administrators.
                It includes authentication with email verification, a student achievements portfolio, and a graduates section for showcasing admissions.
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-slate-500 text-xs">Students</div>
                  <div className="text-xl font-semibold text-slate-900">1,000+</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-slate-500 text-xs">Graduates admitted</div>
                  <div className="text-xl font-semibold text-slate-900">200+</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-slate-500 text-xs">Projects</div>
                  <div className="text-xl font-semibold text-slate-900">50+</div>
                </div>
              </div>

              <div className="mt-5">
                <a href={APPLY_URL} target="_blank" rel="noreferrer">
                  <Button>Apply for Admission</Button>
                </a>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title="Platform features" />
          <CardBody>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
              <li>Secure login with email OTP verification</li>
              <li>Role-based access control (student/teacher/admin)</li>
              <li>Achievements + certificates upload</li>
              <li>Public portfolio view route</li>
              <li>Graduates showcase for admissions</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
