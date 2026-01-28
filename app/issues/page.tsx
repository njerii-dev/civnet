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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const getStatusStats = () => {
    return {
      total: issues.length,
      submitted: issues.filter((i) => i.status === "SUBMITTED").length,
      inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: issues.filter((i) => i.status === "RESOLVED").length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-0">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard - Reported Issues</h1>
              <p className="text-blue-100">Track all community issues and their status</p>
            </div>
            <Link
              href="/issues/report"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
            >
              + Report New Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total Issues</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Submitted</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.submitted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-blue-400">
            <p className="text-gray-600 text-sm font-medium">In Progress</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-green-500">
            <p className="text-gray-600 text-sm font-medium">Resolved</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.resolved}</p>
          </div>
        </div>

        {/* Title and Error Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Issues</h2>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Issues Grid */}
        {issues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4 text-lg">No issues reported yet</p>
            <Link
              href="/issues/report"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Be the first to report an issue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        {/* Admin Section (if user is admin) */}
        {user?.role === "ADMIN" && (
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Admin View</h3>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-gray-600 font-medium mb-2">Administrative Controls</p>
                  <p className="text-sm text-gray-500">
                    Access advanced features to manage issues, view analytics, and configure system settings.
                  </p>
                </div>
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
