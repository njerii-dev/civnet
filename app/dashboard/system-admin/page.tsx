import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllAdmins } from "@/lib/initAdmins";
import {
    Shield,
    Users,
    UserPlus,
    Crown,
    Mail,
    Calendar,
    FileText,
    Settings,
    Trash2
} from "lucide-react";
import AdminManagement from "./AdminManagement";

export default async function SystemAdminPage() {
    const session = await auth();

    // Only system_admin can access this page
    if (!session || (session.user as any)?.role !== "system_admin") {
        redirect("/dashboard");
    }

    const admins = await getAllAdmins();

    // Calculate stats
    const totalAdmins = admins.filter(a => a.role === "admin").length;
    const systemAdmins = admins.filter(a => a.role === "system_admin").length;

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-500/25">
                                <Crown className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                System Control Panel
                            </h1>
                        </div>
                        <p className="text-neutral-500 mt-2 text-lg">
                            Manage administrators and system-wide settings.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full border border-purple-200">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">System Administrator</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        title="System Admins"
                        value={systemAdmins}
                        icon={<Crown className="w-6 h-6 text-purple-600" />}
                        gradient="from-purple-50 to-purple-100"
                        border="border-purple-200"
                    />
                    <StatCard
                        title="Administrators"
                        value={totalAdmins}
                        icon={<Shield className="w-6 h-6 text-indigo-600" />}
                        gradient="from-indigo-50 to-indigo-100"
                        border="border-indigo-200"
                    />
                    <StatCard
                        title="Total Staff"
                        value={admins.length}
                        icon={<Users className="w-6 h-6 text-blue-600" />}
                        gradient="from-blue-50 to-blue-100"
                        border="border-blue-200"
                    />
                </div>
            </div>

            {/* Admin Management Section */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl shadow-neutral-200/50 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-neutral-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/25">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900">Administrator Management</h2>
                    </div>
                </div>

                <AdminManagement initialAdmins={admins} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                    href="/dashboard/admin"
                    className="group p-6 bg-white rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">Issue Management</h3>
                            <p className="text-sm text-neutral-500">View and manage all citizen reports</p>
                        </div>
                    </div>
                </a>
                <a
                    href="/api/init"
                    className="group p-6 bg-white rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                            <Settings className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">Re-initialize Admins</h3>
                            <p className="text-sm text-neutral-500">Sync admin accounts from environment</p>
                        </div>
                    </div>
                </a>
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
