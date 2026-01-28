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
}

export default function IssueCard({ issue, isAdmin = false }: IssueCardProps) {
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
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/issues/${issue.id}`}>
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-5 border-l-4 hover:scale-105`}
        style={{ borderLeftColor: colors.text.replace("text-", "").split("-")[0] === "yellow" ? "#f59e0b" : colors.text.replace("text-", "").split("-")[0] === "blue" ? "#3b82f6" : "#10b981" }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getCategoryIcon(issue.category)}</span>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {issue.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {issue.category}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${colors.bg} ${colors.text}`}>
            <span>{getStatusIcon(issue.status)}</span>
            <span>{issue.status}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
          {issue.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>📍 {issue.citizen.name}</span>
          <span>📅 {daysSinceCreated === 0 ? "Today" : daysSinceCreated === 1 ? "Yesterday" : `${daysSinceCreated} days ago`}</span>
        </div>
      </div>
    </Link>
  );
}
