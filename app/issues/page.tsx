"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center pt-16 md:pt-0">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 md:pt-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard - Reported Issues</h1>
            </div>
            <Link
              href="/issues/report"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-xl">+</span> Report New Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {issues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4 text-lg font-medium">No issues reported yet</p>
            <Link href="/issues/report" className="text-green-600 hover:text-green-700 font-semibold">
              Be the first to report an issue →
            </Link>
          </div>
        ) : (
          <>
            {/* Issues Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                <div>Title</div>
                <div>Category</div>
                <div>Status</div>
                <div>Status</div>
                <div className="text-right">Last Updated</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {issues.map((issue) => {
                  const statusColor = getStatusColor(issue.status);
                  const categoryColor = getCategoryColor(issue.category);
                  const daysAgo = Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <Link key={issue.id} href={`/issues/${issue.id}`}>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-4 hover:bg-blue-50 transition-colors duration-150 cursor-pointer items-center border-l-4 border-transparent hover:border-blue-500">
                        {/* Title */}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{issue.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{issue.category}</p>
                        </div>

                        {/* Category Badge */}
                        <div>
                          <span
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                            style={{
                              backgroundColor: categoryColor.bg,
                              color: categoryColor.text,
                            }}
                          >
                            {categoryColor.icon}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <span
                            className="inline-flex px-3 py-2 rounded-lg text-sm font-semibold"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            {issue.status}
                          </span>
                        </div>

                        {/* Action */}
                        <div>
                          {issue.status === "SUBMITTED" && (
                            <span className="inline-flex text-center px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700">
                              Change Status
                            </span>
                          )}
                          {issue.status === "IN_PROGRESS" && (
                            <span className="inline-flex text-center px-3 py-2 text-xs font-semibold rounded-lg bg-yellow-50 text-yellow-700">
                              Add Comment
                            </span>
                          )}
                          {issue.status === "RESOLVED" && (
                            <span className="inline-flex text-center px-3 py-2 text-xs font-semibold rounded-lg bg-green-50 text-green-700">
                              Resolved
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600 font-medium">
                            {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Admin Section */}
            {user?.role === "ADMIN" && (
              <div className="mt-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-blue-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Admin View</h2>
                        <p className="text-gray-600 text-sm mt-1">Official Response: Crew dispatched, Issue resolved</p>
                      </div>
                      <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
                      >
                        Actions
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
