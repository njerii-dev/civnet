import { db } from "@/lib/db";
import { Clock, MessageSquare, Tag } from "lucide-react";

export default async function CitizenDashboard() {
  const issues = await db.issue.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reported Issues</h1>
          <p className="text-slate-500 mt-1">Track the status of your community improvements</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'} Found
        </div>
      </div>

      <div className="grid gap-4">
        {issues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">No issues reported yet.</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="group p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-blue-100">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        issue.status === 'in progress' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {issue.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Tag size={12} />
                      {issue.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight ">{issue.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{issue.description}</p>

                  {issue.adminComment && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                      <MessageSquare size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Official Response</p>
                        <p className="text-sm text-slate-700 italic">"{issue.adminComment}"</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-slate-400">
                    <Clock size={12} />
                    {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}