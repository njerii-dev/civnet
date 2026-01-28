"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  citizen: {
    id: string;
    name: string;
    email: string;
  };
  respondedBy?: {
    id: string;
    name: string;
  };
  comments: Comment[];
}

export default function IssueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchIssue = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated) {
          router.push("/login");
          return;
        }

        setUser(authData.user);
        fetchIssue();
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/login");
      }
    };

    const fetchIssue = async () => {
      try {
        const res = await fetch(`/api/issues/${issueId}`);
        const data = await res.json();

        if (!res.ok) {
          setError("Issue not found");
          return;
        }

        setIssue(data);
        setNewStatus(data.status);
      } catch (err) {
        console.error("Fetch issue error:", err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchIssue();
  }, [issueId, router]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        setError("Failed to add comment");
        return;
      }

      setNewComment("");
      // Refresh issue to get new comment
      const issueRes = await fetch(`/api/issues/${issueId}`);
      const updatedIssue = await issueRes.json();
      setIssue(updatedIssue);
    } catch (err) {
      console.error("Add comment error:", err);
      setError("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: adminResponse || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update status");
        return;
      }

      setIssue(data.issue);
      setAdminResponse("");
    } catch (err) {
      console.error("Update status error:", err);
      setError("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || "Issue not found"}</p>
          <Link href="/issues" className="text-blue-600 hover:text-blue-800">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";
  const isCitizen = issue.citizen.id === user?.id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/issues" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium">
          ← Back to Issues
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start gap-4 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 flex-1">{issue.title}</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(
                issue.status
              )}`}
            >
              {issue.status}
            </span>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">⚠</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</p>
              <p className="text-lg font-semibold text-gray-900">{issue.category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Reported by</p>
              <p className="text-sm font-medium text-gray-900">{issue.citizen.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date Submitted</p>
              <p className="text-sm text-gray-600">{new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            {issue.respondedBy && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm text-gray-600">{issue.respondedBy.name}</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Issue Details</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
          </div>

          {issue.adminResponse && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-l-green-500">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💬</span> Official Response
              </h2>
              <p className="text-gray-700 leading-relaxed">{issue.adminResponse}</p>
            </div>
          )}
        </div>

        {/* Admin Status Update */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-l-purple-600">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>⚙️</span> Manage Issue Status
            </h2>
            <form onSubmit={handleUpdateStatus} className="space-y-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Update Status *
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="SUBMITTED">🔔 Submitted</option>
                  <option value="IN_PROGRESS">⚙️ In Progress</option>
                  <option value="RESOLVED">✅ Resolved</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="adminResponse"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Response to Citizen (Optional)
                </label>
                <textarea
                  id="adminResponse"
                  rows={4}
                  placeholder="Share an update about this issue or what actions are being taken..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{adminResponse.length}/500</p>
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {updatingStatus ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Updating...
                  </span>
                ) : (
                  "Update Status"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-l-green-600">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💬</span> Updates & Comments
          </h2>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-8 pb-8 border-b">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment or update..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-3"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">{newComment.length}/500</p>
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>

          {/* Display Comments */}
          {issue.comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No updates or comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issue.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-gray-300 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {comment.author.name}
                      </span>
                      {comment.author.role === "ADMIN" && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                          🔑 Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
