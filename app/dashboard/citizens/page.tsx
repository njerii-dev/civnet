import { db } from "@/lib/db";
import { Clock, MessageSquare, Tag, LayoutGrid, CheckCircle2, Timer, AlertCircle } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CitizenDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const isCitizen = (session.user as any).role === 'citizen';

  const issues = await db.issue.findMany({
    where: (isCitizen ? { citizenId: parseInt((session.user as any).id) } : undefined) as any,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <LayoutGrid size={24} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Reported Issues</h1>
          </div>
          <p className="text-slate-500 font-semibold text-lg">Track the status of your community improvements</p>
        </div>
        <div className="text-sm font-extrabold text-brand-primary bg-brand-primary/5 px-5 py-2.5 rounded-2xl border-2 border-brand-primary/10">
          {issues.length} {issues.length === 1 ? 'Report' : 'Reports'} Submitted
        </div>
      </div>

      <div className="grid gap-8">
        {issues.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-xl">No issues reported yet.</p>
            <p className="text-slate-400 font-medium mt-2">Your community contributions will appear here.</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="group p-8 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-brand-primary/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border-2 ${issue.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                      issue.status === 'in progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-brand-primary/5 text-brand-primary border-brand-primary/10'
                      }`}>
                      {issue.status === 'resolved' && <CheckCircle2 size={14} />}
                      {issue.status === 'in progress' && <Timer size={14} />}
                      {issue.status === 'pending' && <Clock size={14} />}
                      {issue.status}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border-2 border-slate-100">
                      <Tag size={14} className="text-brand-primary" />
                      {issue.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors tracking-tight">
                    {issue.title}
                  </h3>

                  <p className="text-slate-600 font-medium leading-relaxed max-w-3xl">
                    {issue.description}
                  </p>

                  {issue.adminComment && (
                    <div className="mt-8 p-6 bg-brand-primary/5 rounded-2xl border-2 border-brand-primary/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <MessageSquare size={64} className="text-brand-primary" />
                      </div>
                      <div className="relative z-10 flex gap-4">
                        <MessageSquare size={20} className="text-brand-primary shrink-0 mt-1" />
                        <div>
                          <p className="text-xs font-extrabold text-brand-primary uppercase tracking-widest mb-2">OFFICIAL RESPONSE</p>
                          <p className="text-slate-700 font-medium italic text-lg leading-relaxed">
                            "{issue.adminComment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-400 px-4 py-2 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <Clock size={16} className="text-brand-accent" />
                    {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}