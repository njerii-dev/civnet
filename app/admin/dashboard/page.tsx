"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const checkAuthAndFetchIssues = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated || authData.user.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        setUser(authData.user);
        
        const res = await fetch("/api/issues");
        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error("Error:", err);
        router.push("/dashboard");
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

  const handleStatusChange = async () => {
    if (!selectedIssue || !newStatus) return;
    
    try {
      const response = await fetch(`/api/issues/${selectedIssue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setIssues(issues.map(issue => 
          issue.id === selectedIssue.id 
            ? { ...issue, status: newStatus }
            : issue
        ));
        setShowStatusModal(false);
        setNewStatus("");
        setSelectedIssue(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleAddComment = async () => {
    if (!selectedIssue || !comment) return;
    
    try {
      const response = await fetch(`/api/issues/${selectedIssue.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        setShowCommentModal(false);
        setComment("");
        setSelectedIssue(null);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Admin View - All Issues</h1>
            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              {filteredIssues.length} issues
            </span>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="p-6 md:p-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Reported By</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No issues found
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map(issue => (
                    <tr key={issue.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{issue.title}</p>
                          <p className="text-sm text-gray-600">{issue.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          issue.status === "SUBMITTED" ? "bg-yellow-100 text-yellow-800" :
                          issue.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {issue.status === "SUBMITTED" && "📋"}
                          {issue.status === "IN_PROGRESS" && "⚙️"}
                          {issue.status === "RESOLVED" && "✅"}
                          <span>{issue.status}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                        {issue.citizen.name}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setNewStatus(issue.status);
                            setShowStatusModal(true);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Status
                        </button>
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowCommentModal(true);
                          }}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition-colors"
                        >
                          Comment
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Modal */}
        {showStatusModal && selectedIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Change Status</h2>
              <p className="text-sm text-gray-600 mb-4">{selectedIssue.title}</p>
              
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="SUBMITTED">📋 Submitted</option>
                <option value="IN_PROGRESS">⚙️ In Progress</option>
                <option value="RESOLVED">✅ Resolved</option>
              </select>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        {showCommentModal && selectedIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Comment</h2>
              <p className="text-sm text-gray-600 mb-4">{selectedIssue.title}</p>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add an update or comment..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 resize-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowCommentModal(false);
                    setComment("");
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
