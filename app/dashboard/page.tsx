"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
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

export default function Dashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
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
        
        const res = await fetch("/api/issues");
        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error("Error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchIssues();
  }, [router]);

  // Get filtered issues
  let filteredIssues = issues;
  if (filterStatus !== "ALL") {
    filteredIssues = issues.filter(issue => issue.status === filterStatus);
  }

  // Mobile bottom navigation
  const MobileNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-20">
      <button className="flex flex-col items-center py-2 px-4 text-blue-600 font-medium">
        <span className="text-xl mb-1">📊</span>
        <span className="text-xs">Dashboard</span>
      </button>
      <button className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600">
        <span className="text-xl mb-1">📋</span>
        <span className="text-xs">My Reports</span>
      </button>
      <button className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600">
        <span className="text-xl mb-1">👤</span>
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <main className="flex-1 md:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard - Reported Issues</h1>
            <button
              onClick={() => router.push("/issues/report")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium md:block hidden"
            >
              + Report New Issue
            </button>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="p-6 md:p-8 pb-20 md:pb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No issues found
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} isAdmin={user?.role === "ADMIN"} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <MobileNav />
      </main>
    </div>
  );
}
