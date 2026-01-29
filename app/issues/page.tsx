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
  citizen: {
    name: string;
    email: string;
  };
}

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated) {
          router.push("/login");
          return;
        }

        setUser(authData.user);
        fetchIssues();
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/login");
      }
    };

    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues");
        const data = await res.json();

        if (!res.ok) {
          setError("Failed to fetch issues");
          return;
        }

        setIssues(data);
      } catch (err) {
        console.error("Fetch issues error:", err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "IN_PROGRESS":
        return { bg: "#DBEAFE", text: "#1E40AF" };
      case "RESOLVED":
        return { bg: "#DCFCE7", text: "#166534" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      ROADS: { bg: "#EFF6FF", text: "#0369A1", icon: "🛣️" },
      LIGHTING: { bg: "#FFFBEB", text: "#B45309", icon: "💡" },
      WASTE: { bg: "#F0FDF4", text: "#166534", icon: "♻️" },
    };
    return colors[category] || { bg: "#F3F4F6", text: "#4B5563", icon: "📍" };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden md:block">
          <Sidebar user={null} />
        </div>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            </div>
            <p className="text-slate-600 mt-4 text-sm font-medium">
              Loading reported issues...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Sort newest first to match brief
  const sortedIssues = [...issues].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Dashboard – Reported Issues
              </h1>
            </div>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              <span>Report New Issue</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠ {error}
          </div>
        )}

        {sortedIssues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-sm text-slate-600 mb-3">
              No issues have been reported yet.
            </p>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Be the first to report an issue
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 px-6 py-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Title</span>
              <span>Category</span>
              <span>Status</span>
              <span className="text-right">Last Updated</span>
            </div>

            <div className="divide-y divide-slate-100">
              {sortedIssues.map((issue) => {
                const statusColor = getStatusColor(issue.status);
                const categoryColor = getCategoryColor(issue.category);
                const daysAgo = Math.floor(
                  (Date.now() - new Date(issue.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <Link key={issue.id} href={`/issues/${issue.id}`}>
                    <div className="px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="grid gap-3 md:grid-cols-[2fr,1fr,1fr,1fr] md:items-center">
                        {/* Title + citizen */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {issue.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                            {issue.citizen?.name} • {issue.citizen?.email}
                          </p>
                        </div>

                        {/* Category pill */}
                        <div className="flex items-center">
                          <span
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: categoryColor.bg,
                              color: categoryColor.text,
                            }}
                          >
                            {categoryColor.icon}
                            <span className="hidden sm:inline">
                              {issue.category}
                            </span>
                          </span>
                        </div>

                        {/* Status pill */}
                        <div className="flex items-center">
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            {issue.status === "SUBMITTED" && "Submitted"}
                            {issue.status === "IN_PROGRESS" && "In Progress"}
                            {issue.status === "RESOLVED" && "Resolved"}
                            {!["SUBMITTED", "IN_PROGRESS", "RESOLVED"].includes(
                              issue.status
                            ) && issue.status}
                          </span>
                        </div>

                        {/* Last updated */}
                        <div className="text-right text-xs text-slate-600">
                          {daysAgo === 0
                            ? "Today"
                            : daysAgo === 1
                            ? "Yesterday"
                            : `${daysAgo} days ago`}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {user?.role === "ADMIN" && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Admin view
              </p>
              <p className="text-sm text-slate-700">
                Switch to the admin dashboard to change statuses and add
                official responses.
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
