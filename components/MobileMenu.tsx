"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

interface MobileMenuProps {
    session: any;
    signOutAction: () => void;
}

export default function MobileMenu({ session, signOutAction }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-600 focus-ring rounded-lg touch-target"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-6 gap-4">
                        <Link
                            href="/dashboard/citizens"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold touch-target"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard size={20} />
                            My Reports
                        </Link>
                        <Link
                            href="/report"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold touch-target"
                            onClick={() => setIsOpen(false)}
                        >
                            <PlusCircle size={20} />
                            New Report
                        </Link>

                        <div className="h-px bg-slate-100 my-2" />

                        {session ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                        {session.user?.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{session.user?.name}</p>
                                        <p className="text-xs text-slate-500">{session.user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        signOutAction();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-semibold touch-target"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/auth/login"
                                    className="flex items-center justify-center p-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold touch-target"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="flex items-center justify-center p-3 rounded-xl bg-brand-primary text-white font-bold touch-target"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Join Civnet
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
