"use client";

import { useState } from "react";
import {
    Crown,
    Shield,
    UserPlus,
    Trash2,
    Mail,
    Calendar,
    FileText,
    X,
    Check,
    Loader2
} from "lucide-react";
import { createAdmin, deleteAdmin } from "@/lib/initAdmins";

interface Admin {
    id: number;
    email: string;
    fullName: string | null;
    role: string | null;
    createdAt: Date | null;
    _count: {
        issues: number;
    };
}

export default function AdminManagement({ initialAdmins }: { initialAdmins: Admin[] }) {
    const [admins, setAdmins] = useState(initialAdmins);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newAdmin, setNewAdmin] = useState({
        email: "",
        password: "",
        fullName: "",
        role: "admin" as "admin" | "system_admin"
    });

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await createAdmin(newAdmin);
            if (result.success && result.user) {
                setAdmins([...admins, {
                    ...result.user,
                    _count: { issues: 0 }
                } as Admin]);
                setShowAddModal(false);
                setNewAdmin({ email: "", password: "", fullName: "", role: "admin" });
            } else {
                setError(result.error as string || "Failed to create admin");
            }
        } catch (err) {
            setError("An error occurred while creating admin");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAdmin = async (userId: number) => {
        if (!confirm("Are you sure you want to demote this admin to citizen?")) return;

        setIsLoading(true);
        try {
            const result = await deleteAdmin(userId);
            if (result.success) {
                setAdmins(admins.filter(a => a.id !== userId));
            } else {
                setError(result.error as string || "Failed to remove admin");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Add Admin Button */}
            <div className="p-6 border-b border-neutral-100">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
                >
                    <UserPlus className="w-5 h-5" />
                    Add New Admin
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Admins Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Assigned Issues</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${admin.role === 'system_admin'
                                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                            }`}>
                                            {admin.role === 'system_admin'
                                                ? <Crown className="w-5 h-5 text-white" />
                                                : <Shield className="w-5 h-5 text-white" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900">{admin.fullName || "Unnamed"}</p>
                                            <p className="text-sm text-neutral-500 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" />
                                                {admin.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${admin.role === 'system_admin'
                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                        {admin.role === 'system_admin' ? <Crown className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                        {admin.role === 'system_admin' ? 'System Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-neutral-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-neutral-400" />
                                        {admin.createdAt
                                            ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })
                                            : 'N/A'
                                        }
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="flex items-center gap-2 text-neutral-600">
                                        <FileText className="w-4 h-4 text-neutral-400" />
                                        {admin._count.issues} issues
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    {admin.role !== 'system_admin' && (
                                        <button
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            disabled={isLoading}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Demote to citizen"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {admins.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-400">No administrators found</p>
                    </div>
                )}
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-purple-600" />
                                Add New Administrator
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newAdmin.fullName}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="admin@civnet.gov"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Role</label>
                                <select
                                    value={newAdmin.role}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as "admin" | "system_admin" })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="admin">Administrator</option>
                                    <option value="system_admin">System Administrator</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Create Admin
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
