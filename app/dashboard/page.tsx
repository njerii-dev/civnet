 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface Issue {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function CitizenDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated) {
          router.push("/login");
          return;
        }

        setUser(authData.user);

        const issuesRes = await fetch("/api/issues");
        const issuesData: Issue[] = await issuesRes.json();

        const mine = issuesData.filter(
          (issue: any) => issue.citizen?.id === authData.user.id
        );

        mine.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setIssues(mine);
      } catch (e) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const submittedCount = issues.filter(
    (i) => i.status === "SUBMITTED"
  ).length;
  const inProgressCount = issues.filter(
    (i) => i.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = issues.filter(
    (i) => i.status === "RESOLVED"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-0">
        <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Citizen dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Welcome back, {user?.name || "Citizen"}
              </h1>
              <p className="mt-2 text-slate-600 max-w-xl text-sm">
                From here you can quickly report new issues, see what you’ve
                already submitted, and track how the city is responding.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/report"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                📝 Report an issue
              </Link>
              <Link
                href="/issues"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                View all community issues
              </Link>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Submitted
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {submittedCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Awaiting review from city officials
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                In progress
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {inProgressCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                City teams are currently working on these
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resolved
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {resolvedCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Completed and closed issues
              </p>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                Your recent reports
              </h2>
              <Link
                href="/my-reports"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>
            {issues.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-slate-500">
                You haven’t reported any issues yet.{" "}
                <Link
                  href="/report"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Start by submitting your first report.
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {issues.slice(0, 5).map((issue) => (
                  <li
                    key={issue.id}
                    className="px-6 py-4 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/issues/${issue.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-700"
                      >
                        {issue.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {issue.category} •{" "}
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                      {issue.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}