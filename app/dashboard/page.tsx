"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import IssueCard from "@/components/IssueCard";

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

export default function CitizenDashboard() {
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

    checkAuthAndFetchIssues();
  }, [router]);

  // Filter issues by user
  let userIssues = issues.filter(issue => issue.citizen.email === user?.email);
  
  if (filterStatus !== "ALL") {
    userIssues = userIssues.filter(issue => issue.status === filterStatus);
  }

  const stats = {
    total: issues.filter(i => i.citizen.email === user?.email).length,
    submitted: issues.filter(i => i.citizen.email === user?.email && i.status === "SUBMITTED").length,
    inProgress: issues.filter(i => i.citizen.email === user?.email && i.status === "IN_PROGRESS").length,
    resolved: issues.filter(i => i.citizen.email === user?.email && i.status === "RESOLVED").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-0">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">👤 My Dashboard</h1>
              <p className="text-blue-100">Track and manage your reported issues</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/issues"
                className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors font-medium shadow-md"
              >
                View All Issues
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-l-blue-600">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">👋 Welcome, {user?.name || 'User'}!</h2>
              <p className="text-gray-600">Email: {user?.email}</p>
              <p className="text-gray-600 mt-1">Role: <span className="font-semibold">{user?.role || 'Citizen'}</span></p>
            </div>
            <div className="text-5xl opacity-20">🏛️</div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-gray-600">
            <p className="text-gray-600 text-sm font-medium">Total Reported</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <p className="text-gray-500 text-xs mt-2">Issues you've reported</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-yellow-500">
            <p className="text-gray-600 text-sm font-medium">🔔 New/Pending</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.submitted}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting review</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-blue-500">
            <p className="text-gray-600 text-sm font-medium">⚙️ In Progress</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
            <p className="text-gray-500 text-xs mt-2">Being handled</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-green-500">
            <p className="text-gray-600 text-sm font-medium">✅ Resolved</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.resolved}</p>
            <p className="text-gray-500 text-xs mt-2">Fixed issues</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/issues/report">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
              <p className="text-3xl mb-3">➕</p>
              <h3 className="text-lg font-bold">Report New Issue</h3>
              <p className="text-green-100 text-sm mt-1">Submit a new community issue</p>
            </div>
          </Link>
          <Link href="/issues">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
              <p className="text-3xl mb-3">📊</p>
              <h3 className="text-lg font-bold">View All Issues</h3>
              <p className="text-blue-100 text-sm mt-1">See all community issues</p>
            </div>
          </Link>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
            <p className="text-3xl mb-3">⭐</p>
            <h3 className="text-lg font-bold">Community Impact</h3>
            <p className="text-purple-100 text-sm mt-1">View issue trends</p>
          </div>
        </div>

        {/* My Issues Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">📋 My Reported Issues</h2>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {userIssues.length} issues
              </span>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {status === "ALL" && "All"}
                  {status === "SUBMITTED" && "🔔 New"}
                  {status === "IN_PROGRESS" && "⚙️ In Progress"}
                  {status === "RESOLVED" && "✅ Resolved"}
                </button>
              ))}
            </div>
          </div>

          {userIssues.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                {filterStatus === "ALL"
                  ? "You haven't reported any issues yet"
                  : `No ${filterStatus.toLowerCase()} issues`}
              </p>
              <Link href="/issues/report" className="text-blue-600 hover:text-blue-800 font-medium mt-4 inline-block">
                Report your first issue now
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tips for Better Reports</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="flex gap-3">
              <span className="text-xl">Location</span>
              <div>
                <p className="font-medium text-gray-900">Be Specific</p>
                <p className="text-gray-600 text-sm">Include exact location and details</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">Context</span>
              <div>
                <p className="font-medium text-gray-900">Add Context</p>
                <p className="text-gray-600 text-sm">Describe the impact of the issue</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">Track</span>
              <div>
                <p className="font-medium text-gray-900">Track Progress</p>
                <p className="text-gray-600 text-sm">Monitor status updates regularly</p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
