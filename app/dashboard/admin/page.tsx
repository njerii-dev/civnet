import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllIssues } from "@/app/actions/issueActions";
import {
    BarChart3,
    CheckCircle2,
    Clock,
    AlertCircle,
    Users,
    Filter
} from "lucide-react";
import IssueTable from "./IssueTable";

export default async function AdminPage() {
    const session = await auth();

    // Basic RBAC check
    if (!session || (session.user as any)?.role !== "admin") {
        redirect("/dashboard");
    }

    const issues = await getAllIssues();

    // Calculate stats
    const totalIssues = issues.length;
    const pendingIssues = issues.filter(i => i.status === "submitted").length;
    const inProgressIssues = issues.filter(i => i.status === "in_progress").length;
    const resolvedIssues = issues.filter(i => i.status === "resolved").length;

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header & Stats Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600">
                            Admin Command Center
                        </h1>
                        <p className="text-neutral-500 mt-2 text-lg">
                            Overseeing CivNet's infrastructure and community reports.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-full border border-neutral-200">
                        <Users className="w-5 h-5 text-neutral-600" />
                        <span className="text-sm font-medium text-neutral-700">Administrator View</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Reports"
                        value={totalIssues}
                        icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
                        gradient="from-blue-50 to-blue-100"
                        border="border-blue-200"
                    />
                    <StatCard
                        title="Pending"
                        value={pendingIssues}
                        icon={<Clock className="w-6 h-6 text-amber-600" />}
                        gradient="from-amber-50 to-amber-100"
                        border="border-amber-200"
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgressIssues}
                        icon={<AlertCircle className="w-6 h-6 text-indigo-600" />}
                        gradient="from-indigo-50 to-indigo-100"
                        border="border-indigo-200"
                    />
                    <StatCard
                        title="Resolved"
                        value={resolvedIssues}
                        icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                        gradient="from-emerald-50 to-emerald-100"
                        border="border-emerald-200"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl shadow-neutral-200/50 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-900 rounded-xl">
                            <Filter className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900">Issue Management</h2>
                    </div>
                </div>

                <IssueTable initialIssues={issues} />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, gradient, border }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    gradient: string;
    border: string;
}) {
    return (
        <div className={`p-6 rounded-2xl border ${border} bg-gradient-to-br ${gradient} shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                    {icon}
                </div>
                <span className="text-3xl font-black text-neutral-900">{value}</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-neutral-600 uppercase tracking-wider">{title}</p>
        </div>
    );
}
