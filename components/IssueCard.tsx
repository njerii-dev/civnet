"use client";

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

interface IssueCardProps {
  issue: Issue;
  isAdmin?: boolean;
  onStatusClick?: (issueId: string) => void;
  onCommentClick?: (issueId: string) => void;
}

export default function IssueCard({ issue, isAdmin = false, onStatusClick, onCommentClick }: IssueCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return { bg: "bg-yellow-100", text: "text-yellow-800", badge: "bg-yellow-50" };
      case "IN_PROGRESS":
        return { bg: "bg-blue-100", text: "text-blue-800", badge: "bg-blue-50" };
      case "RESOLVED":
        return { bg: "bg-green-100", text: "text-green-800", badge: "bg-green-50" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", badge: "bg-gray-50" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "📋";
      case "IN_PROGRESS":
        return "⚙️";
      case "RESOLVED":
        return "✅";
      default:
        return "📌";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      ROADS: "🛣️",
      LIGHTING: "💡",
      WASTE: "♻️",
      PARKS: "🌳",
      OTHER: "📋",
    };
    return icons[category] || "📍";
  };

  const colors = getStatusColor(issue.status);
  const createdDate = new Date(issue.createdAt);
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <Link href={`/issues/${issue.id}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{getCategoryIcon(issue.category)}</span>
            <div>
              <p className="font-medium text-gray-900 hover:text-blue-600">{issue.title}</p>
              <p className="text-sm text-gray-600">{issue.category}</p>
            </div>
          </div>
        </Link>
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
          <span>{getStatusIcon(issue.status)}</span>
          <span>{issue.status}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {issue.status}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formattedDate}
      </td>
      {isAdmin && (
        <td className="px-6 py-4 text-right space-x-2">
          <button
            onClick={() => onStatusClick?.(issue.id)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            Change Status
          </button>
          <button
            onClick={() => onCommentClick?.(issue.id)}
            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition-colors"
          >
            Add Comment
          </button>
        </td>
      )}
    </tr>
  );
}
