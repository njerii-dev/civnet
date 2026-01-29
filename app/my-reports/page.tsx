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

export default function MyReportsPage() {
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
        const issuesData: any[] = await issuesRes.json();

        const mine = issuesData
          .filter((issue) => issue.citizen?.id === authData.user.id)
          .sort(
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-0">
        <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                My reports
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Your reported issues
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Track the status of everything you’ve reported to your city.
              </p>
            </div>
            <Link
              href="/report"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              📝 Report another issue
            </Link>
          </header>

          {issues.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
              You haven’t submitted any issues yet.{" "}
              <Link
                href="/report"
                className="text-blue-600 font-semibold hover:underline"
              >
                Submit your first report.
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  <span>Issue</span>
                  <span>Status</span>
                  <span className="hidden md:block">Category</span>
                  <span className="text-right">Submitted</span>
                </div>
              </div>
              <ul className="divide-y divide-slate-100 text-sm">
                {issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <Link
                      href={`/issues/${issue.id}`}
                      className="grid grid-cols-3 md:grid-cols-4 gap-2 items-center"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {issue.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                          {issue.description}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                          {issue.status}
                        </span>
                      </div>
                      <div className="hidden md:block text-xs text-slate-600">
                        {issue.category}
                      </div>
                      <div className="text-right text-xs text-slate-600">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

