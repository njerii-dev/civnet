"use client";

import { useEffect, useState } from "react";

interface Issue {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  createdAt: string;
  user: { name: string };
}

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/issues")
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/issues/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setIssues(issues.map(i => i.id === id ? { ...i, status: newStatus } : i));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Official Command Centre</h1>
        <p className="text-gray-500">Manage community reports and update resolution progress.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Issue & Reporter</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Current Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{issue.title}</p>
                  <p className="text-xs text-gray-400">By: {issue.user.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{issue.category}</td>
                <td className="px-6 py-4">
                  <select 
                    value={issue.status}
                    onChange={(e) => updateStatus(issue.id, e.target.value)}
                    className="text-xs font-bold px-2 py-1 rounded border bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUBMITTED">🟡 Submitted</option>
                    <option value="IN_PROGRESS">🔵 In Progress</option>
                    <option value="RESOLVED">🟢 Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline text-sm font-medium">Add Comment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}