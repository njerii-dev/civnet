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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const checkAuthAndFetchIssues = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated || authData.user.role !== "ADMIN") {
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

    checkAuthAndFetchIssues();
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

  const filteredIssues = filterStatus === "ALL"
    ? issues
    : issues.filter(issue => issue.status === filterStatus);

  const stats = {
    total: issues.length,
    submitted: issues.filter(i => i.status === "SUBMITTED").length,
    inProgress: issues.filter(i => i.status === "IN_PROGRESS").length,
    resolved: issues.filter(i => i.status === "RESOLVED").length,
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Link
              href="/issues"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              View Issues
            </Link>
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
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border-l-4 border-l-gray-600">
            <p className="text-gray-600 text-sm font-semibold mb-1">📊 Total Issues</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-l-4 border-l-yellow-600">
            <p className="text-yellow-700 text-sm font-semibold mb-1">🔔 Submitted</p>
            <p className="text-4xl font-bold text-yellow-600">{stats.submitted}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-l-blue-600">
            <p className="text-blue-700 text-sm font-semibold mb-1">⚙️ In Progress</p>
            <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-l-green-600">
            <p className="text-green-700 text-sm font-semibold mb-1">✅ Resolved</p>
            <p className="text-4xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🔍 Filter by Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                }`}
              >
                {status === "ALL" && "All Issues"}
                {status === "SUBMITTED" && "🔔 Submitted"}
                {status === "IN_PROGRESS" && "⚙️ In Progress"}
                {status === "RESOLVED" && "✅ Resolved"}
              </button>
            ))}
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredIssues.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">
                {filterStatus === "ALL"
                  ? "No issues yet"
                  : `No ${filterStatus.toLowerCase()} issues`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                        {issue.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {issue.citizen.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {issue.category}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/issues/${issue.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
