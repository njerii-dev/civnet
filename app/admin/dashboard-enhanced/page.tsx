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

interface StatCard {
  label: string;
  value: number;
  color: string;
  icon: string;
  trend?: string;
}

export default function EnhancedAdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      ROADS: "🛣️",
      LIGHTING: "💡",
      WASTE: "♻️",
      OTHER: "📋",
    };
    return icons[category] || "📍";
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // Filtering and sorting logic
  let filteredIssues = issues;

  if (filterStatus !== "ALL") {
    filteredIssues = filteredIssues.filter(issue => issue.status === filterStatus);
  }

  if (selectedCategory !== "ALL") {
    filteredIssues = filteredIssues.filter(issue => issue.category === selectedCategory);
  }

  if (sortBy === "newest") {
    filteredIssues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === "oldest") {
    filteredIssues.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === "title") {
    filteredIssues.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Calculate statistics
  const stats: StatCard[] = [
    {
      label: "Total Issues",
      value: issues.length,
      color: "from-blue-500 to-blue-600",
      icon: "📊",
      trend: "+12% this month",
    },
    {
      label: "New Issues",
      value: issues.filter(i => i.status === "SUBMITTED").length,
      color: "from-yellow-500 to-yellow-600",
      icon: "🔔",
      trend: "Need review",
    },
    {
      label: "In Progress",
      value: issues.filter(i => i.status === "IN_PROGRESS").length,
      color: "from-purple-500 to-purple-600",
      icon: "⚙️",
      trend: "Being handled",
    },
    {
      label: "Resolved",
      value: issues.filter(i => i.status === "RESOLVED").length,
      color: "from-green-500 to-green-600",
      icon: "✅",
      trend: "Completed",
    },
  ];

  const categoryBreakdown = [
    { name: "Roads", icon: "🛣️", count: issues.filter(i => i.category === "ROADS").length },
    { name: "Lighting", icon: "💡", count: issues.filter(i => i.category === "LIGHTING").length },
    { name: "Waste", icon: "♻️", count: issues.filter(i => i.category === "WASTE").length },
    { name: "Other", icon: "📋", count: issues.filter(i => i.category === "OTHER").length },
  ];

  const recentIssues = issues.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-lg border-b border-blue-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">🎛️ Admin Dashboard</h1>
            <p className="text-blue-200 text-sm mt-1">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/issues"
              className="px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors"
            >
              View Issues
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-900 border border-red-700 p-4">
            <p className="text-red-200">⚠️ {error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                  <p className="text-4xl font-bold mt-2">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <p className="text-white/70 text-xs">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {categoryBreakdown.map((cat, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-gray-400 text-sm">{cat.name}</p>
              <p className="text-2xl font-bold text-white mt-2">{cat.count}</p>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🔍 Advanced Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="SUBMITTED">New Issues</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="ROADS">🛣️ Roads</option>
                <option value="LIGHTING">💡 Lighting</option>
                <option value="WASTE">♻️ Waste</option>
                <option value="OTHER">📋 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title (A-Z)</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            📋 Showing {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} out of {issues.length} total
          </p>
        </div>

        {/* Issues List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">📝 All Issues</h2>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">No issues found matching your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-6 hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                        <h3 className="text-lg font-semibold text-white truncate">{issue.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>👤 {issue.citizen.name}</span>
                        <span>📧 {issue.citizen.email}</span>
                        <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link
                      href={`/issues/${issue.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-white font-medium">View Analytics</p>
            <p className="text-gray-400 text-sm">Detailed statistics and trends</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
            <p className="text-2xl mb-2">📧</p>
            <p className="text-white font-medium">Send Notifications</p>
            <p className="text-gray-400 text-sm">Notify citizens about updates</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors cursor-pointer">
            <p className="text-2xl mb-2">📥</p>
            <p className="text-white font-medium">Export Report</p>
            <p className="text-gray-400 text-sm">Download issues data as CSV</p>
          </div>
        </div>
      </main>
    </div>
  );
}
