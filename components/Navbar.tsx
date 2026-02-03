import Link from "next/link";
import { Building2, LogOut, User, PlusCircle, LayoutDashboard } from "lucide-react";
import { auth, signOut } from "@/auth";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  const session = await auth();

  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-2 border-brand-primary shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group touch-target" aria-label="Civnet Home">
          <div className="bg-brand-primary p-2 rounded-xl group-hover:bg-brand-accent transition-all duration-300 shadow-lg shadow-brand-primary/10">
            <Building2 size={24} className="text-white" />
          </div>
          <span className="font-extrabold text-2xl text-brand-primary tracking-tight">Civnet</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 text-sm font-bold">
            <Link href="/dashboard/citizens" className="text-slate-600 hover:text-brand-accent transition-colors flex items-center gap-2 px-2 py-1">
              <LayoutDashboard size={18} />
              My Reports
            </Link>
            <Link href="/report" className="text-slate-600 hover:text-brand-accent transition-colors flex items-center gap-2 px-2 py-1">
              <PlusCircle size={18} />
              New Report
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-5 pl-8 border-l-2 border-slate-100">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border-2 border-slate-200">
                  <User size={16} className="text-brand-primary" />
                  <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                    {session.user?.name}
                  </span>
                </div>
                <form action={handleSignOut}>
                  <button
                    className="p-2.5 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all touch-target focus-ring"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut size={22} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-brand-primary px-4 py-2 transition-colors touch-target focus-ring">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary py-2.5 px-6 shadow-brand-primary/20">
                  Join Civnet
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <MobileMenu session={session} signOutAction={handleSignOut} />
      </div>
    </nav>
  );
}
