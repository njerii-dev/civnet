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
    // Check auth and fetch issues
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
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Civnet</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user?.email}</span>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reported Issues</h2>
            <p className="text-gray-600 mt-1">{issues.length} issues in total</p>
          </div>
          <Link
            href="/issues/report"
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            + Report New Issue
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No issues reported yet</p>
            <Link
              href="/issues/report"
              className="text-blue-600 hover:text-blue-800"
            >
              Be the first to report an issue
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {issues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer p-6 border-l-4 border-l-blue-500 hover:border-l-blue-600">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Category: <span className="font-medium">{issue.category}</span>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>📍 By: {issue.citizen.name}</span>
                    <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
