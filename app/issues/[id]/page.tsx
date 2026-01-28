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
      <div className="max-w-2xl mx-auto">
        <Link href="/issues" className="text-blue-600 hover:text-blue-800 mb-6">
          ← Back to Issues
        </Link>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                issue.status
              )}`}
            >
              {issue.status}
            </span>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {issue.category}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Reported by:</strong> {issue.citizen.name} ({issue.citizen.email})
            </p>
            <p className="text-sm text-gray-600">
              <strong>Submitted:</strong>{" "}
              {new Date(issue.createdAt).toLocaleString()}
            </p>
            {issue.respondedBy && (
              <p className="text-sm text-gray-600">
                <strong>Last updated by:</strong> {issue.respondedBy.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h2>
            <p className="text-gray-700">{issue.description}</p>
          </div>

          {issue.adminResponse && (
            <div className="mb-6 bg-blue-50 p-4 rounded">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Admin Response
              </h2>
              <p className="text-gray-700">{issue.adminResponse}</p>
            </div>
          )}
        </div>

        {/* Admin Status Update */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Update Issue Status
            </h2>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="adminResponse"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admin Response (Optional)
                </label>
                <textarea
                  id="adminResponse"
                  rows={3}
                  placeholder="Add a response or update for the citizen..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {updatingStatus ? "Updating..." : "Update Status"}
              </button>
            </form>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>

          {/* Display Comments */}
          {issue.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {issue.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-gray-300 pl-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.author.name}
                      {comment.author.role === "ADMIN" && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
