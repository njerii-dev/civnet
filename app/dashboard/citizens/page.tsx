import { db } from "@/lib/db";

export default async function CitizenDashboard() {
  const issues = await db.issue.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Reported Issues</h1>
      {issues.map((issue) => (
        <div key={issue.id} className="p-4 bg-white border rounded-lg shadow-sm flex justify-between">
          <div>
            <h3 className="font-bold">{issue.title}</h3>
            <p className="text-gray-600 text-sm">{issue.description}</p>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded h-fit">
            {issue.status}
          </span>
        </div>
      ))}
    </div>
  );
}