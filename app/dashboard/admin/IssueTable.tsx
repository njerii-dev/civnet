'use client';

import { useState } from "react";
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle, ChevronRight, User } from "lucide-react";
import { updateIssueStatus } from "@/app/actions/issueActions";

interface Issue {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string | null;
    adminComment: string | null;
    createdAt: Date | null;
    citizen: {
        fullName: string | null;
        email: string;
    } | null;
}

export default function IssueTable({ initialIssues }: { initialIssues: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const filteredIssues = initialIssues.filter((issue) => {
        const matchesSearch =
            issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.citizen?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || issue.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "in_progress": return "bg-indigo-100 text-indigo-700 border-indigo-200";
            case "submitted": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
        }
    };

    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case "resolved": return <CheckCircle className="w-3.5 h-3.5" />;
            case "in_progress": return <AlertCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[700px]">
            {/* Sidebar/List */}
            <div className="w-full lg:w-1/3 border-r border-neutral-100 flex flex-col bg-white">
                <div className="p-4 border-b border-neutral-100 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search issues or citizens..."
                            className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'submitted', 'in_progress', 'resolved'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s
                                        ? "bg-black text-white shadow-lg shadow-black/20"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                    }`}
                            >
                                {s === 'submitted' ? 'pending' : s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-neutral-50 custom-scrollbar">
                    {filteredIssues.map((issue) => (
                        <button
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            className={`w-full text-left p-5 transition-all hover:bg-neutral-50 flex items-start justify-between group ${selectedIssue?.id === issue.id ? "bg-neutral-50 border-l-4 border-black" : "border-l-4 border-transparent"
                                }`}
                        >
                            <div className="space-y-1 pr-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(issue.status)}`}>
                                        {getStatusIcon(issue.status)}
                                        {issue.status === 'submitted' ? 'pending' : issue.status}
                                    </span>
                                    <span className="text-[10px] font-medium text-neutral-400">#{issue.id}</span>
                                </div>
                                <h3 className="font-bold text-neutral-900 group-hover:text-black line-clamp-1">{issue.title}</h3>
                                <p className="text-xs text-neutral-500 line-clamp-1">{issue.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center">
                                        <User className="w-3 h-3 text-neutral-500" />
                                    </div>
                                    <span className="text-[11px] font-medium text-neutral-600 italic">
                                        {issue.citizen?.fullName || "Anonymous Citizen"}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-neutral-300 transition-transform group-hover:translate-x-1 ${selectedIssue?.id === issue.id ? "text-black" : ""}`} />
                        </button>
                    ))}
                    {filteredIssues.length === 0 && (
                        <div className="p-10 text-center space-y-3">
                            <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center">
                                <Search className="w-6 h-6 text-neutral-300" />
                            </div>
                            <p className="text-sm font-medium text-neutral-500">No issues found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Area */}
            <div className="flex-1 bg-white overflow-y-auto p-6 md:p-10 custom-scrollbar">
                {selectedIssue ? (
                    <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{selectedIssue.category}</p>
                                    <h2 className="text-3xl font-black text-neutral-900 leading-tight">{selectedIssue.title}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-neutral-400">Reported On</p>
                                    <p className="text-sm font-bold text-neutral-900">
                                        {selectedIssue.createdAt ? new Date(selectedIssue.createdAt).toLocaleDateString() : 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Description
                                </label>
                                <div className="p-6 bg-neutral-50 rounded-2xl text-neutral-700 leading-relaxed border border-neutral-100 shadow-inner">
                                    {selectedIssue.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-8">
                                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Citizen Details</p>
                                    <p className="text-sm font-bold text-neutral-900 truncate">{selectedIssue.citizen?.fullName || "Anonymous"}</p>
                                    <p className="text-xs text-neutral-500 truncate">{selectedIssue.citizen?.email}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Current Status</p>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedIssue.status)}`}>
                                        {getStatusIcon(selectedIssue.status)}
                                        {selectedIssue.status === 'submitted' ? 'pending' : selectedIssue.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Action Form */}
                        <div className="pt-10 border-t-2 border-dashed border-neutral-100">
                            <div className="bg-neutral-900 rounded-3xl p-8 shadow-2xl shadow-black/20">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    Administrative Action
                                </h3>
                                <form action={async (formData) => {
                                    formData.append("issueId", selectedIssue.id.toString());
                                    try {
                                        await updateIssueStatus(formData);
                                        // Update local state to reflect change immediately if possible, 
                                        // or let revalidatePath handle it (though we are in client)
                                        alert("Issue updated successfully!");
                                        window.location.reload(); // Simple way to refresh data
                                    } catch (e) {
                                        alert("Error updating issue");
                                    }
                                }} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Update Status</label>
                                        <select
                                            name="status"
                                            defaultValue={selectedIssue.status || "submitted"}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/50 outline-none transition-all appearance-none cursor-pointer hover:bg-white/20"
                                        >
                                            <option value="submitted" className="text-black">Pending (Submitted)</option>
                                            <option value="in_progress" className="text-black">In Progress</option>
                                            <option value="resolved" className="text-black">Resolved</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Admin Comment</label>
                                        <textarea
                                            name="adminComment"
                                            defaultValue={selectedIssue.adminComment || ""}
                                            placeholder="Add an official response or update notes..."
                                            rows={4}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/50 outline-none transition-all resize-none placeholder:text-neutral-500 hover:bg-white/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                                    >
                                        Post Administrative Update
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-300 space-y-6">
                        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 shadow-inner">
                            <AlertCircle className="w-12 h-12 text-neutral-200" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-neutral-400">No Issue Selected</h3>
                            <p className="text-sm">Select a report from the list to view details and take action.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
