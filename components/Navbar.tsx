import Link from "next/link";
import { Building2, LogOut, User, PlusCircle, LayoutDashboard } from "lucide-react";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Civnet</span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/dashboard/citizens" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={16} />
              My Reports
            </Link>
            <Link href="/report" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <PlusCircle size={16} />
              New Report
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="flex items-center gap-2.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <User size={14} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                </div>
                <form action={async () => {
                  "use server";
                  await signOut();
                }}>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Sign Out">
                    <LogOut size={20} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 px-4 py-2 transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200 active:scale-[0.98]">
                  Join Civnet
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}